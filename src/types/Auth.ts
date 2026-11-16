import { registerSchema, loginSchema } from "../schemas/auth.schema";
import { z } from "zod";

export type LoginRequest = z.infer<typeof loginSchema>;
export type Register = z.infer<typeof registerSchema>;

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
