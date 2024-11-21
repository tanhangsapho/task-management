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
  accessToken: string | null;
  user: User | null;
  setAuth: (auth: AuthResponse | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      setAuth: (auth) =>
        set({
          accessToken: auth?.accessToken || null, // Use `accessToken`
          user: auth?.user || null,
          isAuthenticated: !!auth?.accessToken,
        }),
      logout: () =>
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);
