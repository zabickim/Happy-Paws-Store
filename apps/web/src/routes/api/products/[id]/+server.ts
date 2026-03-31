import { json, error, isHttpError } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma.js";
import type { RequestHandler } from "./$types.js";

export const GET: RequestHandler = async ({ params }) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      error(404, { message: "Product not found" });
    }

    return json(product);
  } catch (err: unknown) {
    if (isHttpError(err)) throw err; // re-throw SvelteKit errors
    console.error("Failed to fetch product:", err);
    return json({ error: "Failed to fetch product" }, { status: 500 });
  }
};
