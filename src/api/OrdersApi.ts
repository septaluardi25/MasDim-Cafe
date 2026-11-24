import type { OrderPayload, OrderResponse } from "../types/Orders";
import { useAuthStore } from "../stores/authStore";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getOrder = async (): Promise<OrderResponse[]> => {
  const token = useAuthStore.getState().token;
  const response = await fetch(`${BASE_URL}/orders`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (!response.ok) throw new Error("gagal mendapatkan order");
  const result = await response.json();
  return result.data;
};

export const postOrder = async (data: OrderPayload) => {
  const token = useAuthStore.getState().token;
  const response = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("order gagal");
  return await response.json();
};
