import type { Menu } from "../types/Menu";
import type { MenuDetailResponse } from "../types/MenuDetail";
const BASE_URL = import.meta.env.VITE_API_URL;

export const getMenus = async (): Promise<Menu[]> => {
  const response = await fetch(`${BASE_URL}/menu`);

  if (!response.ok) throw new Error("Gagal mengambil data Menu");

  const data = await response.json();
  return data.data;
};

export const getMenuDetail = async (
  id: string,
): Promise<MenuDetailResponse> => {
  const response = await fetch(`${BASE_URL}/menu/${id}`);

  if (!response.ok) throw new Error("Gagal mengambil data Menu");

  const data = await response.json();
  console.log(data);
  return data;
};
