import api from '@/services/apiService';
import { create } from 'zustand';

interface Appointment {
  id: string;
  clientId: string;
  startDate: string; // ISO 8601 format
  endDate: string;   // ISO 8601 format
}

interface AppointmentState {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  fetchAppointments: () => Promise<void>;
  setAppointment: (appointment: Appointment) => void;
  clearAppointment: () => void;
}

export const useAppointmentStore = create<AppointmentState>((set) => ({
  appointments: [],
  loading: false,
  error: null,
  fetchAppointments: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/appointments");
      const data: Appointment[] = response.data;
      set({ appointments: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  setAppointment: (appointment) =>
    set((state) => ({
      appointments: [...state.appointments, appointment],
    })),
  clearAppointment: () => set({ appointments: [] }),
}));
