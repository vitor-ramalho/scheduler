import { AppointmentData } from '@/components/modals/CreateAppointmentModal';
import api from './apiService';

export async function fetchAvailableTimeSlots(date: string, consultationType: string) {
  const response = await api.get(`/appointments/slots?date=${date}&type=${consultationType}`);
  return response.data;
}

export async function bookAppointment(appointmentData: AppointmentData) {
  const response = await api.post(`/appointments/${appointmentData.professionalId}`, appointmentData);
  return response.data;
}
