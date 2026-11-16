import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { User } from "../types/Auth";

interface AuthState {
  user: User | null;
  token: string | null;
  isLogin: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set): AuthState => ({
      user: null,
      token: null,
      isLogin: false,

      login: (token, user) => set({ token, user, isLogin: true }),
      logout: () => set({ token: null, user: null, isLogin: false }),
    }),
    { name: "auth-storage" },
  ),
);
