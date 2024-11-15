import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthResponse } from "../api/auth";

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (auth: AuthResponse | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (auth) =>
        set({
          token: auth?.token || null,
          user: auth?.user || null,
          isAuthenticated: !!auth?.token,
        }),
      logout: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);
