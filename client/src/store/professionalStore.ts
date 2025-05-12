/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { create } from "zustand";
import api from "@/services/apiService";

interface Professional {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  active: boolean;
}

interface ProfessionalState {
  professionals: Professional[];
  loading: boolean;
  error: string | null;
  fetchProfessionals: () => Promise<void>;
}

export const useProfessionalStore = create<ProfessionalState>((set) => ({
  professionals: [],
  loading: false,
  error: null,
  fetchProfessionals: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/professionals");
      set({ professionals: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
