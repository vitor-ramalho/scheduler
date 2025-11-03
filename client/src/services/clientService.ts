import api from "./apiService";

export interface Client {
  id?: string;
  identifier?: string;
  name: string;
  phone: string;
  email: string;
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

export async function addClient(clientData: Client) {
  const response = await api.post("/clients", clientData);
  return response.data;
}

export async function fetchClients(): Promise<Client[]> {
  const response = await api.get("/clients");
  return response.data;
}

export async function updateClient(clientId: string, clientData: Client) {
  const response = await api.put(`/clients/${clientId}`, clientData);
  return response.data;
}

export async function deleteClient(clientId: string) {
  const response = await api.delete(`/clients/${clientId}`);
  return response.data;
}