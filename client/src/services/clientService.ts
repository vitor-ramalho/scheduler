import api from "./apiService";

export interface ClientData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  identifier?: string;
  organizationId?: string;
  [key: string]: string | undefined;
}

export async function getClientByIdentifier(identifier: string) {
  try {
    const response = await api.get(`/clients/search?identifier=${identifier}`);
    return response.data[0];
  } catch (error) {
    console.error("Error fetching client by identifier:", error);
    throw error;
  }
}

export async function addClient(clientData: ClientData) {
  const response = await api.post("/clients", clientData);
  return response.data;
}
