import api from "./apiService";
import { useUserStore } from "../store/userStore";

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "user";
  organization: {
    id: string;
    name: string;
    slug: string;
    identifier?: string;
    phone?: string;
    email?: string;
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

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationName: string;
  organizationIdentifier?: string;
  organizationPhone?: string;
  organizationEmail?: string;
}

export async function register(data: RegisterData) {
  try {
    const response = await api.post("/auth/register", data);
    const { user, accessToken, refreshToken } = response.data;

    useUserStore.getState().setUser(user, accessToken, refreshToken);

    return { user, accessToken, refreshToken };
  } catch {
    throw new Error("Registration failed");
  }
}
