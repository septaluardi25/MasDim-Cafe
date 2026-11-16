import { ZodError } from "zod";

export const getErrorMessage = (error: unknown) => {
  if (error instanceof ZodError) return error.message;
  if (error instanceof Error) return error.message;
  return "terjadi kesalahan";
};
