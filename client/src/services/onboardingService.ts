import api  from './apiService';

interface CompanyInfo {
  name?: string;
  document?: string;
  address?: string;
  phone?: string;
  website?: string;
  planId?: string;
}

interface Organization {
  id: string;
  name: string;
  document: string;
  address: string;
  phone: string;
  website: string;
  planId?: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function updateCompany(organizationId: string, companyInfo: CompanyInfo): Promise<Organization | null> {
  try {
    const response = await api.put(`/organizations/${organizationId}`, companyInfo);
    return response.data;
  } catch (error) {
    console.error('Error updating company:', error);
    return null;
  }
}