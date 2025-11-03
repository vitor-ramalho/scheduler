import api from './apiService';

export interface OrganizationStats {
  id: string;
  name: string;
  slug: string;
  identifier: string;
  phone: string;
  email: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  usersCount: number;
  clientsCount: number;
  appointmentsCount: number;
}

export interface BackofficeStats {
  totalOrganizations: number;
  enabledOrganizations: number;
  disabledOrganizations: number;
  totalUsers: number;
  totalAppointments: number;
}

class BackofficeService {
  async getStats(): Promise<BackofficeStats> {
    const response = await api.get('/backoffice/stats');
    return response.data;
  }

  async getOrganizations(): Promise<OrganizationStats[]> {
    const response = await api.get('/backoffice/organizations');
    return response.data;
  }

  async getOrganizationById(id: string): Promise<OrganizationStats> {
    const response = await api.get(`/backoffice/organizations/${id}`);
    return response.data;
  }

  async enableOrganization(id: string): Promise<void> {
    await api.patch(`/backoffice/organizations/${id}/enable`);
  }

  async disableOrganization(id: string): Promise<void> {
    await api.patch(`/backoffice/organizations/${id}/disable`);
  }
}

export const backofficeService = new BackofficeService();