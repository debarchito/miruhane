import { z } from "zod";

export const formSchema = z
  .object({
    // RFC 5321, SMTP Protocol, limits the email address to 254 characters
    email: z.string().email().max(254),
    password: z.string(),
    confirmPassword: z.string(),
  })
  .refine((schema) => schema.password == schema.confirmPassword, {
    message: "Passwords do not match",
  });
