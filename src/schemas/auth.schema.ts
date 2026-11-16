import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email").trim(),
  password: z.string().min(6, "Password requires at least 6 characters"),
});

export const registerSchema = z.object({
  email: z.email("Invalid email").trim(),
  password: z.string().min(6, "Password requires at least 6 characters"),
  name: z.string().trim().min(3, "Name requires at least 8 characters"),
});
