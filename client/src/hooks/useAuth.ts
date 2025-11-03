"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { logout } from '@/services/authService';

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
        clearUser(); // Ensure state is cleared
        // Removido: router.push('/sign-in'); 
        // Não força redirecionamento - deixa cada página decidir
      }
    }
  }, [accessToken, setUser, clearUser]);

  const setLogin = () => {
    // Redirecionar baseado no role do usuário
    if (user?.role === 'admin') {
      router.push('/backoffice');
    } else if (user?.organization && !user.organization.enabled) {
      router.push('/organization-disabled');
    } else {
      router.push('/dashboard');
    }
  };

  const setLogout = async () => {
    await logout();
    clearUser();
    router.push('/sign-in');
  };

  return { isAuthenticated: !!accessToken, setLogin, setLogout, user };
}
