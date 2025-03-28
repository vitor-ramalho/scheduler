import api from "./apiService";

export async function getClientByIdentifier(identifier: string) {
  try {
    const response = await api.get(`/clients?identifier=${identifier}`);
    return response.data[0];
  } catch (error) {
    console.error("Error fetching client by identifier:", error);
    throw error;
  }
}
