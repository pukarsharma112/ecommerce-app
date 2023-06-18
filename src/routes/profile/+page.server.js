import sharp from "sharp";
import { fail } from "@sveltejs/kit";
import { verify, hash } from "argon2";
import { superValidate, setError } from "sveltekit-superforms/server";

import { prisma } from "$lib/server/prisma";
import { profileSchema, updatePasswordSchema } from "$lib/utilities/zod-schema";

export async function load(event) {
  const { name, email } = await event.locals.getCurrentUser();

  const profileForm = await superValidate({ name, email }, profileSchema);
  const passwordForm = await superValidate(updatePasswordSchema);

  return {
    profileForm,
    passwordForm
  };
}

export const actions = {
  async updateProfile(event) {
    const currentUser = await event.locals.getCurrentUser();
    const profileForm = await superValidate(event.request, profileSchema);

    if (!profileForm.valid) return fail(400, { profileForm });

    if (currentUser.email !== profileForm.data.email) {
      const exists = await prisma.user.count({
        where: { email: profileForm.data.email }
      });
      if (exists) {
        setError(profileForm, "email", "This email address is already in use.");
      }
    }

    if (
      currentUser.name !== profileForm.data.name ||
      currentUser.email !== profileForm.data.email
    ) {
      await prisma.user.update({
        where: { id: currentUser.id },
        data: profileForm.data
      });
    }
    event.locals.setFlash({
      type: "success",
      id: "update-profile",
      message: "Your profile is updated successfully."
    });

    return { profileForm };
  },

  async updatePassword(event) {
    const currentUser = await event.locals.getCurrentUser();
    const passwordForm = await superValidate(event.request, updatePasswordSchema);

    if (!passwordForm.valid) return fail(400, { passwordForm });

    const user = await prisma.user.findFirst({
      where: { id: currentUser.id },
      select: { password: true }
    });

    if (!(await verify(user.password, passwordForm.data.currentPassword))) {
      return setError(passwordForm, "currentPassword", "Invalid password.");
    }

    if (passwordForm.data.currentPassword === passwordForm.data.password) {
      return setError(
        passwordForm,
        "password",
        "Your new password can't match the current password."
      );
    }

    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        password: await hash(passwordForm.data.password)
      }
    });

    event.locals.setFlash({
      type: "success",
      id: "update-password",
      message: "Your password is updated successfully."
    });

    return { passwordForm };
  },

  async updateAvatar(event) {
    const currentUser = await event.locals.getCurrentUser();

    const formData = await event.request.formData();
    const profilePicture = formData.get("profilePicture");

    if (!profilePicture) {
      event.locals.setFlash({
        type: "error",
        id: "user-avatar",
        message: "Please upload a file to update your profile picture."
      });
    }

    const imageBuffer = await profilePicture.arrayBuffer();
    const imageFileName = `/uploads/${crypto.randomUUID()}.png`;

    try {
      // image processing
      const image = await sharp(imageBuffer)
        .resize({ width: 300, height: 300 })
        .toFile(`${process.cwd()}/static/${imageFileName}`);

      await prisma.user.update({
        where: { id: currentUser.id },
        data: {
          avatar: new URL(imageFileName, event.url.origin).toString()
        }
      });

      event.locals.setFlash({
        type: "success",
        id: "user-avatar",
        message: "Your profile picture was update successfully."
      });
    } catch (e) {
      console.log(e);

      event.locals.setFlash({
        type: "error",
        id: "user-avatar",
        message: "Something went wrong while trying to update your profile picture."
      });
    }
  },

  async deleteAvatar(event) {
    const currentUser = await event.locals.getCurrentUser();
    const url = new URL(currentUser.avatar);

    if (url.origin !== "https://ui-avatars.com") {
      await prisma.user.update({
        where: { id: currentUser.id },
        data: {
          avatar: encodeURI(`https://ui-avatars.com/api/?name=${currentUser.name}&rounded`)
        }
      });
    }

    event.locals.setFlash({
      type: "success",
      id: "user-avatar",
      message: "Your profile picture is removed now."
    });
  }
};
