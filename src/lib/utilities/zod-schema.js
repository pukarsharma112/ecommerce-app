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

  city: z
    .string({ required_error: "Please enter your city." })
    .trim()
    .nonempty("Please enter your city."),
  country: z
    .string({ required_error: "Please enter your country." })
    .trim()
    .nonempty("Please enter your country."),

  state: z
    .string({ required_error: "Please enter your state." })
    .trim()
    .nonempty("Please enter your state."),

  postalCode: z
    .string({ required_error: "Please enter the postal code." })
    .trim()
    .nonempty("Please enter the postal code."),

  phoneNumber: z
    .string({ required_error: "Please enter your phone number. " })
    .trim()
    .nonempty("Please enter your phone number.")
    .regex(PHONE_NUMBER_REGEX, "Please enter a valid phone number."),

  quantity: z.number(),
  paymentMethod: z.string()
});
