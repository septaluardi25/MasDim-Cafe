import { create } from "zustand";

interface MenuModalState {
  selectedMenuId: string | null;
  isOpen: boolean;

  openMenu: (id: string) => void;
  closeMenu: () => void;
}
export const useMenuDetailStore = create<MenuModalState>((set) => ({
  selectedMenuId: null,
  isOpen: false,

  openMenu: (id) => set({ selectedMenuId: id, isOpen: true }),
  closeMenu: () => set({ selectedMenuId: null, isOpen: false }),
}));
