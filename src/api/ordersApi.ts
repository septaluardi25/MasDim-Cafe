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

export const putOrder = async ({
  id,
  status,
}: {
  id: string;
  status: string;
}) => {
  const token = useAuthStore.getState().token;
  const response = await fetch(`${BASE_URL}/orders/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error("Gagal menyelesaikan pesanan");
  console.log(response);
  return await response.json();
};

export const deleteOrder = async (id: string) => {
  const token = useAuthStore.getState().token;
  const response = await fetch(`${BASE_URL}/orders/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (!response.ok) throw new Error("Gagal menghapus order");
  return await response.json();
};
