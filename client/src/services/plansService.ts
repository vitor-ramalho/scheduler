import api from "./apiService";

export interface IPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
  interval: string;
  createdAt: string;
  updatedAt: string;
}

export async function getPlans(): Promise<IPlan[]> {
  try {
    const response = await api.get("/plans");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch plans:", error);
    throw new Error("Failed to fetch plans");
  }
}

export async function getPlan(id: string): Promise<IPlan> {
  try {
    const response = await api.get(`/plans/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch plan with id ${id}:`, error);
    throw new Error("Failed to fetch plan");
  }
}
