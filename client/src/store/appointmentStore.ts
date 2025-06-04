import api from '@/services/apiService';
import { create } from 'zustand';

export interface Client { 
  identifier: string,
  name: string,
  phone: string,
  email: string,
}

interface Appointment {
  id: string;
  clientId: string;
  startDate: string; // ISO 8601 format
  endDate: string;   // ISO 8601 format
  client: Client
}

interface AppointmentState {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  fetchAppointments: (professionalId: string) => Promise<void>;
  setAppointment: (appointment: Appointment) => void;
  clearAppointment: () => void;
}

export const useAppointmentStore = create<AppointmentState>((set) => ({
  appointments: [],
  loading: false,
  error: null,
  fetchAppointments: async (professionalId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/appointments/${professionalId}`);
      const data: Appointment[] = response.data;
      set({ appointments: data, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      set({ error: errorMessage, loading: false });
    }
  },
  setAppointment: (appointment) =>
    set((state) => ({
      appointments: [...state.appointments, appointment],
    })),
  clearAppointment: () => set({ appointments: [] }),
}));
