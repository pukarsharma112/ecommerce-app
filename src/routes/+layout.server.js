import { prisma } from "$lib/server/prisma";
import { loadFlash } from "sveltekit-flash-message/server";

const getUserCartCount = (userId) => {
  if (!userId) return 0;
  return prisma.cart.count({ where: { userId } }).catch(() => 0);
};

export async function load(event) {
  const currentUser = await event.locals.getCurrentUser(false);

  return {
    currentUser,
    flash: loadFlash(event).flash,
    cartCount: getUserCartCount(currentUser?.id),
    referer: event.request.headers.get("referer")
  };
}
