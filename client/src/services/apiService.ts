import axios from 'axios';
import { useUserStore } from '../store/userStore';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const accessToken = useUserStore.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      useUserStore.getState().refreshToken
    ) {
      originalRequest._retry = true;
      try {
        const { refreshToken } = useUserStore.getState();
        const response = await api.post('/auth/refresh', { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data;

        useUserStore.getState().setUser(
          useUserStore.getState().user!,
          accessToken,
          newRefreshToken
        );

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError.response?.data?.message || refreshError.message);
        useUserStore.getState().clearUser(); // Clear user state on refresh failure
        return Promise.reject(refreshError);
      }
    }

    // Clear user state if 401 occurs and no refresh token is available
    if (error.response?.status === 401) {
      useUserStore.getState().clearUser();
    }

    return Promise.reject(error);
  }
);

export default api;
