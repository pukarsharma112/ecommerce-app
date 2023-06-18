import { prisma } from "$lib/server/prisma";
import { loadProducts } from "$lib/server/functions";

async function getWishList(userId) {
  const ids = new Set();

  if (userId) {
    const userWishList = await prisma.wishlist.findMany({
      where: { userId },
      select: { productId: true }
    });

    userWishList.forEach((w) => ids.add(w.productId));
  }

  return ids;
}

export async function load(event) {
  const currentUser = await event.locals.getCurrentUser(false);

  const productsData = await loadProducts(event);

  return { ...productsData, userWishList: getWishList(currentUser?.id) };
}
