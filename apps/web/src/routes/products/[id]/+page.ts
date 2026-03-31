import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types.js";
import type { IProduct } from "$lib/types/index.js";

export const load: PageLoad = async ({ fetch, params }) => {
  const res = await fetch(`/api/products/${params.id}`);

  if (res.status === 404) {
    error(404, "Product not found");
  }

  if (!res.ok) {
    error(500, "Failed to load product");
  }

  const product: IProduct = await res.json();

  return { product };
};
