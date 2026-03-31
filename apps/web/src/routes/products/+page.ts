import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types.js";
import type { IProduct } from "$lib/types/index.js";

export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch("/api/products");

  if (!res.ok) {
    error(500, "Failed to load products");
  }

  const products: IProduct[] = await res.json();

  return { products };
};
