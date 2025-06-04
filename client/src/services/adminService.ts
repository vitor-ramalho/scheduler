import api from './apiService';

export interface Organization {
  id: string;
  name: string;
  isPlanActive: boolean;
  planExpiresAt?: string;
  plan?: {
    id: string;
    name: string;
    price: number;
  };
  paymentId?: string;
}

export interface OrganizationUpdateData {
  name?: string;
  isPlanActive?: boolean;
  planExpiresAt?: string | null;
  planId?: string;
  paymentId?: string | null;
}

export interface SubscriptionAnalytics {
  totalOrganizations: number;
  activeSubscriptions: number;
  expiringWithin30Days: number;
  renewedLast30Days: number;
  cancelledLast30Days: number;
  revenueMetrics: {
    currentMonthRevenue: number;
    prevMonthRevenue: number;
    mrr: number;
    growthRate: number;
  };
}

export interface SubscriptionHistory {
  id: string;
  status: string;
  organizationId: string;
  planId: string;
  plan?: {
    id: string;
    name: string;
    price: number;
  };
  expiresAt?: string;
  isRenewal: boolean;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
}

export async function getOrganizations(): Promise<Organization[]> {
  try {
    const response = await api.get('/admin/organizations');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch organizations:', error);
    throw new Error('Failed to fetch organizations');
  }
}

export async function getOrganization(id: string): Promise<Organization> {
  try {
    const response = await api.get(`/admin/organizations/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch organization with id ${id}:`, error);
    throw new Error('Failed to fetch organization');
  }
}

export async function updateOrganization(id: string, data: OrganizationUpdateData): Promise<Organization> {
  try {
    const response = await api.patch(`/admin/organizations/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Failed to update organization with id ${id}:`, error);
    throw new Error('Failed to update organization');
  }
}

export async function deleteOrganization(id: string): Promise<void> {
  try {
    await api.delete(`/admin/organizations/${id}`);
  } catch (error) {
    console.error(`Failed to delete organization with id ${id}:`, error);
    throw new Error('Failed to delete organization');
  }
}

export async function getSubscriptionAnalytics(): Promise<SubscriptionAnalytics> {
  try {
    const response = await api.get('/subscription-analytics/summary');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch subscription analytics:', error);
    throw new Error('Failed to fetch subscription analytics');
  }
}

export async function getSubscriptionHistory(organizationId: string): Promise<SubscriptionHistory[]> {
  try {
    const response = await api.get(`/subscription-analytics/history/${organizationId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch subscription history for organization ${organizationId}:`, error);
    throw new Error('Failed to fetch subscription history');
  }
}
