import { z } from "zod";

const PHONE_NUMBER_REGEX =
  /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Please enter your email address." })
    .trim()
    .email("Please enter a valid email address."),
  password: z
    .string({ required_error: "Please enter your password." })
    .trim()
    .nonempty("Please enter your password.")
    .min(6, "Password must be atleast six characters long.")
});

export const registerSchema = z.object({
  name: z
    .string({ required_error: "Please enter your full name." })
    .trim()
    .nonempty("Please enter your full name."),
  email: z
    .string({ required_error: "Please enter your email address." })
    .trim()
    .email("Please enter a valid email address."),
  password: z
    .string({ required_error: "Please enter your password." })
    .trim()
    .nonempty("Please enter your password.")
    .min(6, "Password must be atleast six characters long.")
});

export const profileSchema = registerSchema.pick({ name: true, email: true });

export const updatePasswordSchema = z
  .object({
    currentPassword: z
      .string({ required_error: "Please enter your current password." })
      .trim()
      .nonempty("Please enter your current password")
      .min(6, "Invalid password."),
    password: z
      .string({ required_error: "Please enter your password." })
      .trim()
      .nonempty("Please enter your password.")
      .min(6, "Password must be atleast six characters long."),
    confirmPassword: z
      .string({ required_error: "Please re-enter your password to confirm." })
      .trim()
      .nonempty("Please re-enter your password to confirm.")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  });

export const checkoutBillingSchema = z.object({
  email: z
    .string({ required_error: "Please enter your email address." })
    .trim()
    .email("Please enter a valid email address."),
  fullName: z
    .string({ required_error: "Please enter your full name." })
    .trim()
    .nonempty("Please enter your full name."),

  address: z
    .string({ required_error: "Please enter your address." })
    .trim()
    .nonempty("Please enter your address."),

  postalCode: z
    .string({ required_error: "Please enter the postal code." })
    .trim()
    .nonempty("Please enter the postal code."),

  phoneNumber: z
    .string({ required_error: "Please enter your phone number. " })
    .trim()
    .nonempty("Please enter your phone number.")
    .regex(PHONE_NUMBER_REGEX, "Please enter a valid phone number."),

  quantity: z.number().optional(),
  paymentMethod: z.string(),
  deliveryMethod: z.string()
});
