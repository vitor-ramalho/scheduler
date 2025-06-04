import api from "./apiService";
import { useUserStore } from "../store/userStore";

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "user" | "superadmin";
  organization: {
    id: string;
    name: string;
    slug: string;
    plan: {
      id: string;
      name: string;
      description: string;
      price: string;
      features: string[];
      interval: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}

export async function login(email: string, password: string) {
  try {
    const response = await api.post("/auth/login", { email, password });
    const { user, accessToken, refreshToken } = response.data;

    useUserStore.getState().setUser(user, accessToken, refreshToken);

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));

    return user;
  } catch {
    throw new Error("Login failed");
  }
}

export async function logout() {
  try {
    await api.post("/auth/logout");
    useUserStore.getState().clearUser();

    // Clear cookies
    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie =
      "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  } catch {
    throw new Error("Logout failed");
  }
}

export async function register(
  email: string,
  password: string,
  organizationName: string,
  firstName: string,
  lastName: string,
  planId?: string
) {
  try {
    const response = await api.post("/auth/register", {
      email,
      password,
      organizationName,
      firstName,
      lastName,
      planId,
    });
    const { user, accessToken, refreshToken } = response.data;

    useUserStore.getState().setUser(user, accessToken, refreshToken);

    return { user, accessToken, refreshToken };
  } catch {
    throw new Error("Registration failed");
  }
}

export async function isSuperAdmin() {
  try {
    const response = await api.get('/users/me/is-superadmin');
    return response.data.isSuperAdmin;
  } catch (error) {
    console.error('Failed to check superadmin status:', error);
    return false;
  }
}
