import { json } from "@sveltejs/kit";
import { loadProducts } from "./lib/functions.server";

export async function GET(event) {
  const result = await loadProducts(event);
  return json(result);
}
