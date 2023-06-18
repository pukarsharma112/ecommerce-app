import { json } from "@sveltejs/kit";
import { loadProducts } from "$lib/server/functions";

export async function GET(event) {
  return json(await loadProducts(event));
}
