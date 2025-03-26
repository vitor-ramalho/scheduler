"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';

export function useAuth() {
  const router = useRouter();
  const { user, accessToken, clearUser, setUser } = useUserStore();

  useEffect(() => {
    if (!accessToken) {
      const storedAccessToken = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');
      if (storedAccessToken && storedUser) {
        setUser(JSON.parse(storedUser), storedAccessToken, localStorage.getItem('refreshToken') || '');
      } else {
        router.push('/sign-in');
      }
    }
  }, [accessToken, router, setUser]);

  const setLogin = (token: string) => {
    // Token is already set in the state during login
    router.push('/dashboard');
  };

  const setLogout = async () => {
    await logout();
    clearUser();
    router.push('/sign-in');
  };

  return { isAuthenticated: !!accessToken, setLogin, setLogout, user };
}
