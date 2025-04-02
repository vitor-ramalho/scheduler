"use client";

import api from "@/services/apiService";
import { create } from "zustand";

interface Plan {
  id: string;
  name: string;
  price: string;
  interval: string;
}

interface PlanState {
  plans: Plan[];
  loading: boolean;
  error: string | null;
  fetchPlans: () => Promise<void>;
}

export const usePlanStore = create<PlanState>((set) => ({
  plans: [],
  loading: false,
  error: null,
  fetchPlans: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/plans");
      set({ plans: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
