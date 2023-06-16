import { redirect } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";

const getWishList = (userId) => {
  return prisma.wishlist.findMany({
    where: { userId },
    select: {
      product: {
        select: {
          id: true,
          tags: true,
          title: true,
          price: true,
          discount: true,
          ratings: true,
          images: {
            select: { url: true }
          }
        }
      }
    }
  });
};

export async function load(event) {
  await event.parent();
  const currentUser = await event.locals.getCurrentUser();
  return { wishlist: getWishList(currentUser.id) };
}

export const actions = {
  async addToList(event) {
    const currentUser = await event.locals.getCurrentUser();
    const formData = await event.request.formData();

    const userId = currentUser.id;
    const productId = formData.get("productId");

    const exists = await prisma.wishlist.count({
      where: {
        AND: [{ userId }, { productId }]
      }
    });

    if (!exists) {
      await prisma.wishlist.create({
        data: { userId, productId }
      });

      event.locals.setFlash({
        id: "wishlist",
        type: "success",
        message: "Product added to wishlist."
      });
    }

    throw redirect(301, event.request.headers.get("referer") ?? "/");
  },
  async removeFromList(event) {
    const currentUser = await event.locals.getCurrentUser();
    const formData = await event.request.formData();

    const userId = currentUser.id;
    const productId = formData.get("productId");

    const wishlist = await prisma.wishlist.findFirst({
      where: {
        AND: [{ userId }, { productId }]
      },
      select: { id: true }
    });

    if (wishlist) {
      await prisma.wishlist.delete({
        where: { id: wishlist.id }
      });
      event.locals.setFlash({
        type: "info",
        id: "wishlist",
        message: "Product removed from to wishlist."
      });
    }

    throw redirect(301, event.request.headers.get("referer") ?? "/");
  }
};
