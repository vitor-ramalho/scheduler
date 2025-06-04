import api from "./apiService";

export interface ProfessionalData {
  name: string;
  email: string;
  phone?: string;
  specialization?: string;
  registrationNumber?: string;
  bio?: string;
  workingHours?: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
  organizationId?: string;
  availability?: Record<string, unknown>;
  [key: string]: string | object | undefined;
}

export async function addProfessional(professionalData: ProfessionalData) {
  const response = await api.post("/professionals", professionalData);
  return response.data;
}

export async function updateProfessional(id: string, professionalData: Partial<ProfessionalData>) {
  const response = await api.put(`/professionals/${id}`, professionalData);
  return response.data;
}

export async function deleteProfessional(id: string) {
  const response = await api.delete(`/professionals/${id}`);
  return response.data;
}
