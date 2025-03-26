import { create } from 'zustand';

interface Appointment {
  patientId: string;
  date: string;
  time: string;
  consultationType: string;
  notes: string;
}

interface AppointmentState {
  appointment: Appointment | null;
  setAppointment: (appointment: Appointment) => void;
  clearAppointment: () => void;
}

export const useAppointmentStore = create<AppointmentState>((set) => ({
  appointment: null,
  setAppointment: (appointment) => set({ appointment }),
  clearAppointment: () => set({ appointment: null }),
}));
