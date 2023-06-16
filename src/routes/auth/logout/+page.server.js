import { redirect } from "@sveltejs/kit";

export const actions = {
  async default(event) {
    event.cookies.delete("sid", {
      path: "/"
    });

    event.locals.setFlash({
      id: "auth",
      type: "success",
      message: "You're logged out from your account."
    });

    throw redirect(301, "/auth/login");
  }
};
