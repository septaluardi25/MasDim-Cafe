import { useAuthStore } from "../stores/authStore";
import type { ReviewsPayload } from "../types/Reviews";

const BASE_URL = import.meta.env.VITE_API_URL;

export const postReview = async (data: ReviewsPayload) => {
  const token = useAuthStore.getState().token;
  const response = await fetch(`${BASE_URL}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Review gagal");
  return await response.json();
};
