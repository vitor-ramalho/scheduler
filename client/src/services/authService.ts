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
    plan: "basic" | "premium";
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
  lastName: string
) {
  try {
    const response = await api.post("/auth/register", {
      email,
      password,
      organizationName,
      firstName,
      lastName,
    });
    const { user, accessToken, refreshToken } = response.data;

    useUserStore.getState().setUser(user, accessToken, refreshToken);

    return { user, accessToken, refreshToken };
  } catch {
    throw new Error("Registration failed");
  }
}
