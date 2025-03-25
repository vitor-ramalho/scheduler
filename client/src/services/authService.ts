import api from './apiService';
import { useUserStore } from '../store/userStore';

export async function login(email: string, password: string) {
  const response = await api.post('/auth/login', { email, password });
  const { user, accessToken, refreshToken } = response.data;

  useUserStore.getState().setUser(user, accessToken, refreshToken);
}
