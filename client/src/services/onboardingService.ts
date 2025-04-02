import api from "./apiService";

export async function updateCompany(
  organizationId: string,
  companyData: unknown
) {
  try {
    const response = await api.patch(
      `/organizations/${organizationId}`,
      companyData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
