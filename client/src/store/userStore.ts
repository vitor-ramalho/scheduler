"use client";

import { create } from "zustand";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  organization: {
    id: string;
    name: string;
    slug: string;
    plan: string;
  };
}

interface UserState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setUser: (user: User, accessToken: string, refreshToken: string) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => {
  let storedUser = null;
  let storedAccessToken = null;
  let storedRefreshToken = null;

  if (typeof window !== "undefined") {
    storedUser = localStorage.getItem("user");
    storedAccessToken = localStorage.getItem("accessToken");
    storedRefreshToken = localStorage.getItem("refreshToken");
  }

  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    accessToken: storedAccessToken || null,
    refreshToken: storedRefreshToken || null,
    setUser: (user, accessToken, refreshToken) => {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      set({ user, accessToken, refreshToken });
    },
    clearUser: () => {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      set({ user: null, accessToken: null, refreshToken: null });
    },
  };
});
