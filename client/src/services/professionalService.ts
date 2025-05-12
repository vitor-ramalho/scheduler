import { Professional } from "@/app/dashboard/professionals/components/ProfessionalsPage";
import api from "./apiService";

export async function addProfessional(professionalData: Professional) {
  const response = await api.post("/professionals", professionalData);
  return response.data;
}

export async function updateProfessional(id: string, professionalData: Professional) {
  const response = await api.put(`/professionals/${id}`, professionalData);
  return response.data;
}

export async function deleteProfessional(id: string) {
  const response = await api.delete(`/professionals/${id}`);
  return response.data;
}
