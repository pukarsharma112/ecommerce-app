import { error } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";

const getIsWishListed = async ({ productId, userId }) => {
  if (!productId || !userId) return false;

  const count = await prisma.wishlist.count({
    where: { AND: [{ userId }, { productId }] }
  });

  return !!count;
};

const getIsOnCart = async ({ productId, userId }) => {
  if (!productId || !userId) return false;

  const count = await prisma.cart.count({
    where: { AND: [{ userId }, { productId }] }
  });

  return !!count;
};

export async function load(event) {
  const productId = event.params.productId;
  const { currentUser } = await event.parent();

  const product = await prisma.product.findFirst({
    where: { id: productId },
    include: { images: true, sizes: true, colors: true }
  });

  if (!product) throw error(404, "Product not found!");

  const userId = currentUser?.id;

  return {
    product,
    isOnCart: getIsOnCart({ productId, userId }),
    isOnWishList: getIsWishListed({ productId, userId })
  };
}
