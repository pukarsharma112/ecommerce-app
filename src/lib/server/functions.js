import { prisma } from "$lib/server/prisma";

export function loadCurrentUser(userId) {
  if (!userId) return undefined;
  return prisma.user
    .findFirst({
      where: { id: userId },
      select: { id: true, name: true, email: true, avatar: true }
    })
    .catch(() => undefined);
}

export async function getUserCart(userId) {
  if (!userId) return [];

  return await prisma.cart.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
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

export async function loadProducts(event) {
  const collection = event.params.collection;
  const query = event.url.searchParams.get("query");
  const cursor = event.url.searchParams.get("cursor");
  const pageNumber = event.url.searchParams.get("page");
  const sorting = event.url.searchParams.get("sorting");

  let orderBy = { id: "asc" };

  if (sorting) {
    if (sorting === "newest-first") {
      orderBy = { id: "asc" };
    } else {
      const [key, value] = sorting.split("-");
      orderBy = { [key]: value };
    }
  }

  const p = pageNumber ? parseInt(pageNumber) : undefined;

  const limit = 7;
  const searchCondition = {};

  // based on collection
  if (collection) {
    if (!searchCondition["AND"]) searchCondition["AND"] = [];
    searchCondition["AND"] = [...searchCondition["AND"], { tags: collection.toUpperCase() }];
  }

  // searching
  if (query) {
    if (!searchCondition["AND"]) searchCondition["AND"] = [];
    searchCondition["AND"] = [
      ...searchCondition["AND"],
      { OR: [{ title: { contains: query } }, { tags: { contains: query } }] }
    ];
  }

  const products = await prisma.product.findMany({
    skip: p ? p * limit : undefined,
    take: limit + 1,
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
    },
    orderBy,
    where: searchCondition,
    cursor: cursor ? { id: cursor } : undefined
  });

  let nextCursor = undefined;

  if (products.length > limit) {
    nextCursor = products.pop().id;
  }

  return { products, nextCursor };
}
