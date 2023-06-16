import { hash } from "argon2";
import { fail, redirect } from "@sveltejs/kit";
import { superValidate, setError } from "sveltekit-superforms/server";

import { prisma } from "$lib/server/prisma";
import { registerSchema } from "$lib/utilities/zod-schema";

const createUser = async (data) => {
  try {
    const user = await prisma.user.create({
      data: {
        ...data,
        password: await hash(data.password),
        avatar: encodeURI(`https://ui-avatars.com/api/?name=${data.name}&rounded`)
      }
    });
    return { user };
  } catch (error) {
    return { error };
  }
};

export const load = async (event) => {
  const form = await superValidate(registerSchema);
  return { form };
};

export const actions = {
  async default(event) {
    const form = await superValidate(event, registerSchema);

    if (!form.valid) return fail(400, { form });

    const emailExists = await prisma.user.count({
      where: { email: form.data.email }
    });

    if (emailExists) {
      return setError(form, "email", "This email address is already in use.");
    }

    const { user, error } = await createUser(form.data);

    if (error) {
      event.locals.setFlash({
        id: "auth",
        type: "error",
        message: "Something went wrong while trying to register for new account."
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

    throw redirect(301, event.request.headers.get("referer") ?? "/");
  }
};
