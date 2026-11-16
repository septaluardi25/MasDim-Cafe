import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Menu } from "../types/Menu";

interface CartItem extends Menu {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (menu: Menu) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItem: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (menu) => {
        set((state) => {
          const existing = state.items.find((item) => item.id === menu.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === menu.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          }
          return { items: [...state.items, { ...menu, quantity: 1 }] };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items
            .map((item) => (item.id === id ? { ...item, quantity } : item))
            .filter((item) => item.quantity > 0),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalItem: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce((sum, i) => sum + i.quantity * i.price, 0),
    }),
    { name: "cart-storage" },
  ),
);
