import { verify } from "argon2";
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";

import { prisma } from "$lib/server/prisma";
import { loginSchema } from "$lib/utilities/zod-schema";

export async function load() {
  const form = await superValidate(loginSchema);
  return { form };
}

export const actions = {
  async default(event) {
    const form = await superValidate(event.request, loginSchema);

    if (!form.valid) return fail(400, { form });

    const user = await prisma.user.findFirst({
      where: { email: form.data.email },
      select: { id: true, name: true, password: true }
    });

    if (!user || !(await verify(user.password, form.data.password))) {
      event.locals.setFlash({
        id: "auth",
        type: "error",
        message: "Invalid credentials!"
      });

      return { form };
    }

    event.cookies.set("sid", user.id, {
      path: "/",
      maxAge: 10000
    });

    event.locals.setFlash({
      id: "auth",
      type: "success",
      message: `Welcome, ${user.name}!`
    });

    throw redirect(301, "/");
  }
};
