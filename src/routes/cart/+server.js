import { json } from "@sveltejs/kit";

import { prisma } from "$lib/server/prisma";
import { getUserCart } from "./lib/functions.server";

export async function GET(event) {
  const currentUser = await event.locals.getCurrentUser(false);
  const userCart = await getUserCart(currentUser?.id);
  return json({ userCart });
}
