import api from './apiService';
import { useUserStore } from '../store/userStore';

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
  organization: {
    id: string;
    name: string;
    slug: string;
    plan: 'basic' | 'premium';
  };
}

export async function login(email: string, password: string) {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { user, accessToken, refreshToken } = response.data;

    // Update the state immediately
    useUserStore.getState().setUser(user, accessToken, refreshToken);

    // Store tokens securely in local storage
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));

    return user;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
}

export async function logout() {
  try {
    await api.post('/auth/logout');
    useUserStore.getState().clearUser();

    // Clear cookies
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
  } catch (error: any) {
    console.error('Logout failed:', error.response?.data?.message || error.message);
  }
}

export async function register(email: string, password: string, organizationName: string) {
  try {
    const response = await api.post('/auth/register', {
      email,
      password,
      organizationName,
    });
    const { user, accessToken, refreshToken } = response.data;

    // Update the state immediately
    useUserStore.getState().setUser(user, accessToken, refreshToken);

    return { user, accessToken, refreshToken };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
}
