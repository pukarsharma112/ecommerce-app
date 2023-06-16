import { redirect } from "@sveltejs/kit";
import { setFlash } from "sveltekit-flash-message/server";

import { prisma } from "$lib/server/prisma";

function loadCurrentUser(userId) {
  if (!userId) return undefined;
  return prisma.user
    .findFirst({
      where: { id: userId },
      select: { id: true, name: true, avatar: true }
    })
    .catch(() => undefined);
}

export const handle = async ({ resolve, event }) => {
  // helper function to set flash message
  event.locals.setFlash = (f) => setFlash(f, event);

  // helper function to get current user
  event.locals.getCurrentUser = async (throwOnUnauthorized = true) => {
    const currentUser = await loadCurrentUser(event.cookies.get("sid"));

    if (!currentUser && throwOnUnauthorized) {
      event.locals.setFlash({
        id: "auth",
        type: "error",
        message: "Please login to your account to continue."
      });
      throw redirect(301, "/auth/login");
    }

    return currentUser;
  };

  return resolve(event);
};
