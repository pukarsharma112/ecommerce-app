import { prisma } from "$lib/server/prisma";

export async function load(event) {
  await event.parent();
  const currentUser = await event.locals.getCurrentUser();

  const invoices = await prisma.invoice.findMany({
    where: { userId: currentUser.id },
    select: {
      id: true,
      paid: true,
      status: true,
      total: true,
      createdAt: true,
      paymentMethod: true,
      orders: {
        select: {
          id: true,
          quantity: true,
          discount: true,
          total: true,
          product: {
            select: {
              id: true,
              title: true,
              price: true,
              description: true,
              images: {
                select: {
                  url: true
                }
              }
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return { invoices };
}
