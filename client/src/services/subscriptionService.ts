import api from './apiService';
import { IPlan } from './plansService';

export interface ISubscription {
  isPlanActive: boolean;
  planExpiresAt?: string;
  plan: IPlan;
}

export interface ISubscriptionResponse {
  organization: {
    id: string;
    name: string;
    isPlanActive: boolean;
    planExpiresAt?: string;
    plan: IPlan;
  };
}

export interface ICreateSubscriptionResponse {
  id: string;
  amount: number;
  status: string;
  brCode: string;
  brCodeBase64: string;
  expiresAt: string;
  plan: IPlan;
  organization: {
    id: string;
    name: string;
  };
}

export async function createSubscription(planId: string, organizationId: string, userId: string): Promise<ICreateSubscriptionResponse> {
  try {
    const response = await api.post('/subscriptions', {
      planId,
      organizationId,
      userId
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create subscription:', error);
    throw new Error('Failed to create subscription');
  }
}

export async function getSubscriptionStatus(organizationId: string): Promise<ISubscriptionResponse> {
  try {
    const response = await api.get(`/subscriptions/${organizationId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to get subscription status:', error);
    throw new Error('Failed to get subscription status');
  }
}
