import { create } from 'zustand';

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

export const useUserStore = create<UserState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  setUser: (user, accessToken, refreshToken) =>
    set({ user, accessToken, refreshToken }),
  clearUser: () => set({ user: null, accessToken: null, refreshToken: null }),
}));
