import { redirect, error } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";

import { prisma } from "$lib/server/prisma";
import { checkoutBillingSchema } from "$lib/utilities/zod-schema";

const shipping = 14.34;

export async function load(event) {
  await event.locals.getCurrentUser();
  const form = await superValidate(checkoutBillingSchema);

  return { form };
}

export const actions = {
  async default(event) {
    const form = await superValidate(event, checkoutBillingSchema);

    if (!form.valid) throw error(400, { form });

    const currentUser = await event.locals.getCurrentUser();
    const userId = currentUser.id;

    const product = await prisma.product.findFirst({
      where: { id: event.params.productId },
      select: { id: true, quantity: true, discount: true, price: true }
    });

    if (!product) throw error(404, "Product not found!");

    if (product.quantity <= 0) {
      event.locals.setFlash({
        id: "checkout",
        type: "warning",
        message: "Product out of stock!"
      });
    }

    // if quantity at cart is more than available stock,
    // purchase atmost available quantity
    const quantity = product.quantity > form.data.quantity ? form.data.quantity : product.quantity;

    const price = product.price;
    const discount = product.discount;

    const subtotal = price * quantity;
    const totalDiscount = discount * quantity;

    const total = subtotal - totalDiscount + shipping;

    await prisma.product.update({
      where: { id: product.id },
      data: { quantity: product.quantity - quantity }
    });

    const invoice = await prisma.invoice.create({
      data: {
        total,
        userId,
        paymentMethod: form.data.paymentMethod,
        orders: {
          create: {
            total,
            userId,
            quantity,
            productId: product.id,
            discount: totalDiscount
          }
        }
      }
    });

    event.locals.setFlash({
      id: "checkout",
      type: "success",
      message: "Checkout completed!"
    });

    throw redirect(301, "/invoices");
  }
};
