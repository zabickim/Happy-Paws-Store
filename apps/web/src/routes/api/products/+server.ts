import { json } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma.js";
import type { RequestHandler } from "./$types.js";

export const GET: RequestHandler = async () => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "asc" },
    });

    return json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return json({ error: "Failed to fetch products" }, { status: 500 });
  }
};
