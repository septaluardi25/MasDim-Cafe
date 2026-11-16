import type { LoginRequest, LoginResponse } from "../types/Auth";

const BASE_URL = import.meta.env.VITE_API_URL;

export const authLogin = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const json = await response.json();
  if (!response.ok) throw new Error(json.Error || "Login gagal");
  return json;
};
