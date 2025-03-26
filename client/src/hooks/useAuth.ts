"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';

export function useAuth() {
  const router = useRouter();
  const { user, accessToken, clearUser } = useUserStore();

  useEffect(() => {
    if (!accessToken) {
      // Redirect to sign-in if no access token is found
      router.push('/sign-in');
    }
  }, [accessToken, router]);

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
