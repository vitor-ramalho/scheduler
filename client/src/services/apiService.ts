import axios from 'axios';
import { useUserStore } from '../store/userStore';
import Router from 'next/router';

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api`,
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
      originalRequest._retry = true; // Mark the request as retried
      try {
        const { refreshToken } = useUserStore.getState();
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/auth/refresh`,
          null, // No payload
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`, // Send refresh token in the header
            },
          }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Update user state with new tokens
        useUserStore.getState().setUser(
          useUserStore.getState().user!,
          accessToken,
          newRefreshToken
        );

        // Update the original request with the new access token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest); // Retry the original request
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError.response?.data?.message || refreshError.message);
        useUserStore.getState().clearUser(); // Clear user state on refresh failure
        Router.push('/'); // Redirect to the home page
        return Promise.reject(refreshError); // Stop retrying
      }
    }

    // Clear user state if 401 occurs and no refresh token is available
    if (error.response?.status === 401) {
      useUserStore.getState().clearUser();
      Router.push('/'); // Redirect to the home page
    }

    return Promise.reject(error);
  }
);

export default api;
