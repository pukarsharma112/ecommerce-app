import { prisma } from "$lib/server/prisma";

export async function getUserCart(userId) {
  if (!userId) return [];

  return await prisma.cart.findMany({
    where: { userId },
    select: {
      id: true,
      quantity: true,
      product: {
        select: {
          id: true,
          tags: true,
          title: true,
          price: true,
          discount: true,
          quantity: true,
          images: {
            select: {
              url: true
            }
          }
        }
      }
    }
  });
}
