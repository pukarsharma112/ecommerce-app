import { redirect, error } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";

import { prisma } from "$lib/server/prisma";
import { getUserCart } from "./lib/functions.server";
import { checkoutBillingSchema } from "$lib/utilities/zod-schema";

const shipping = 14.34;

export async function load(event) {
  const currentUser = await event.locals.getCurrentUser();
  const form = await superValidate(checkoutBillingSchema);
  return { userCart: getUserCart(currentUser.id), form };
}

export const actions = {
  async addToCart(event) {
    const currentUser = await event.locals.getCurrentUser();
    const formData = await event.request.formData();

    const userId = currentUser.id;
    const productId = formData.get("productId");

    const exists = await prisma.cart.count({
      where: {
        AND: [{ userId }, { productId }]
      }
    });

    if (!exists) {
      await prisma.cart.create({
        data: { userId, productId, quantity: 1 }
      });

      event.locals.setFlash({
        id: "cart",
        type: "success",
        message: "Product added to your cart."
      });
    }

    throw redirect(301, event.request.headers.get("referer") ?? "/");
  },
  async removeFromCart(event) {
    const currentUser = await event.locals.getCurrentUser();
    const formData = await event.request.formData();

    const userId = currentUser.id;
    const productId = formData.get("productId");

    const cart = await prisma.cart.findFirst({
      where: {
        AND: [{ userId }, { productId }]
      }
    });

    if (cart) {
      await prisma.cart.delete({
        where: { id: cart.id }
      });

      event.locals.setFlash({
        id: "cart",
        type: "info",
        message: "Product removed from your cart."
      });
    }

    throw redirect(301, event.request.headers.get("referer") ?? "/");
  },

  async checkout(event) {
    const form = await superValidate(event, checkoutBillingSchema);

    if (!form.valid) throw error(400, { form });

    const currentUser = await event.locals.getCurrentUser();
    const userId = currentUser.id;

    const cart = await prisma.cart.findMany({
      where: { userId },
      select: {
        id: true,
        quantity: true,
        product: {
          select: {
            id: true,
            price: true,
            discount: true,
            quantity: true
          }
        }
      }
    });

    const quantityUpdates = new Map();

    const ordersData = cart
      .map((c) => {
        // if no product available at stock
        if (c.product.quantity <= 0) return;

        // if quantity at cart is more than available stock,
        // purchase atmost available quantity
        const quantity = c.product.quantity > c.quantity ? c.quantity : c.product.quantity;

        const price = c.product.price;
        const discount = c.product.discount;

        const subtotal = price * quantity;
        const totalDiscount = discount * quantity;

        quantityUpdates.set(c.product.id, c.product.quantity - quantity);

        return {
          userId,
          quantity,
          productId: c.product.id,
          discount: totalDiscount,
          total: subtotal - totalDiscount + shipping
        };
      })
      .filter(Boolean);

    const total = ordersData.reduce((acc, cur) => acc + cur.total, 0);

    for (const id of quantityUpdates.keys()) {
      await prisma.product.update({
        where: { id },
        data: { quantity: quantityUpdates.get(id) }
      });
    }

    const invoice = await prisma.invoice.create({
      data: {
        total,
        userId,
        paymentMethod: form.data.paymentMethod,
        orders: { create: ordersData }
      }
    });

    await prisma.cart.deleteMany({
      where: {
        id: {
          in: cart.map((c) => c.id)
        }
      }
    });

    event.locals.setFlash({
      id: "checkout",
      type: "success",
      message: "Checkout completed!"
    });

    return { form };
  }
};
