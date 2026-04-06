import Stripe from "stripe";
import { error } from "@sveltejs/kit";
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from "$env/static/private";
import { prisma } from "$lib/server/prisma.js";
import type { RequestHandler } from "./$types.js";

const stripe = new Stripe(STRIPE_SECRET_KEY);

interface ICartMetaItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
}

export const POST: RequestHandler = async ({ request }) => {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    error(400, "Missing Stripe signature");
  }

  // Raw body is required for signature verification
  const rawBody = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    error(400, "Invalid webhook signature");
  }

  if (event.type !== "checkout.session.completed") {
    return new Response(null, { status: 200 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (session.payment_status !== "paid") {
    return new Response(null, { status: 200 });
  }

  const existing = await prisma.order.findUnique({
    where: { stripeSessionId: session.id },
  });

  if (existing) {
    console.log(`Order for session ${session.id} already exists, skipping.`);
    return new Response(null, { status: 200 });
  }

  let cartItems: ICartMetaItem[];

  try {
    cartItems = JSON.parse(session.metadata?.cart ?? "[]");
  } catch {
    console.error("Failed to parse cart metadata:", session.metadata?.cart);
    error(500, "Invalid cart metadata");
  }

  if (!cartItems.length) {
    error(400, "Empty cart in metadata");
  }

  // Persist order + items in a single transaction
  await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        stripeSessionId: session.id,
        totalAmount: session.amount_total ?? 0,
        status: "PAID",
      },
    });

    await tx.orderItem.createMany({
      data: cartItems.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        productName: item.productName,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
      })),
    });
  });

  console.log(`✅ Order saved for Stripe session ${session.id}`);

  return new Response(null, { status: 200 });
};
