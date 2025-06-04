import api from "./apiService";

export interface PatientData {
  name: string;
  dateOfBirth?: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  clientId: string;
  medicalHistory?: string;
  notes?: string;
  [key: string]: string | undefined;
}

export async function fetchPatients(query: string) {
  const response = await api.get(`/patients?search=${query}`);
  return response.data;
}

export async function fetchPatientById(patientId: string) {
  const response = await api.get(`/patients/${patientId}`);
  return response.data;
}

export async function addPatient(patientData: PatientData) {
  const response = await api.post("/patients", patientData);
  return response.data;
}

export async function updatePatient(patientId: string, patientData: Partial<PatientData>) {
  const response = await api.put(`/patients/${patientId}`, patientData);
  return response.data;
}
