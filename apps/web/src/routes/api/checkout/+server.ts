import Stripe from "stripe";
import { json, error } from "@sveltejs/kit";
import { STRIPE_SECRET_KEY } from "$env/static/private";
import { PUBLIC_BASE_URL } from "$env/static/public";
import { prisma } from "$lib/server/prisma.js";
import type { RequestHandler } from "./$types.js";

interface CartLineItem {
  productId: string;
  quantity: number;
}

const stripe = new Stripe(STRIPE_SECRET_KEY);

export const POST: RequestHandler = async ({ request }) => {
  let body: { items: CartLineItem[] };

  try {
    body = await request.json();
  } catch {
    error(400, "Invalid request body");
  }

  const { items } = body;

  if (!items || items.length === 0) {
    error(400, "Cart is empty");
  }

  // Fetch all products from DB to get authoritative prices
  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  if (products.length !== productIds.length) {
    error(400, "One or more products not found");
  }

  // Build Stripe line items using DB prices (never trust client-side prices)
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
    (cartItem) => {
      const product = products.find((p) => p.id === cartItem.productId)!;

      return {
        quantity: cartItem.quantity,
        price_data: {
          currency: "usd",
          unit_amount: product.price, // already in cents
          product_data: {
            name: product.name,
            description: product.description,
            images: [product.imageUrl],
          },
        },
      };
    },
  );

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    success_url: `${PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${PUBLIC_BASE_URL}/checkout/cancel`,
    metadata: {
      // Serialise cart so the webhook can reconstruct the order
      cart: JSON.stringify(
        items.map((cartItem) => {
          const product = products.find((p) => p.id === cartItem.productId)!;
          return {
            productId: product.id,
            productName: product.name,
            unitPrice: product.price,
            quantity: cartItem.quantity,
          };
        }),
      ),
    },
  });

  return json({ url: session.url });
};
