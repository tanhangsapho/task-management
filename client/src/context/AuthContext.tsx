"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authAPI, AuthResponse } from "@/lib/api/auth";

interface AuthState {
  user: AuthResponse["user"] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (provider: "google" | "github") => void;
  logout: () => Promise<void>;
}

// Create context with a default value matching the interface
const defaultAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const data = await authAPI.getCurrentUser();
      console.log("User Info:", data);
      if (data.user) {
        console.log("User authenticated:", data.user);

        setState({ user: data.user, isAuthenticated: true, isLoading: false });
      }
    } catch (error) {
      console.error("Authentication failed:", error);
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const login = (provider: "google" | "github") => {
    if (provider === "google") {
      authAPI.initiateGoogleAuth();
    } else {
      authAPI.initiateGithubAuth();
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      if (mounted) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const value = {
    ...state,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
