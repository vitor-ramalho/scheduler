import api from "./apiService";

export async function fetchPatients(query: string) {
  const response = await api.get(`/patients?search=${query}`);
  return response.data;
}

export async function fetchPatientById(patientId: string) {
  const response = await api.get(`/patients/${patientId}`);
  return response.data;
}

export async function addPatient(patientData: any) {
  const response = await api.post("/patients", patientData);
  return response.data;
}

export async function updatePatient(patientId: string, patientData: any) {
  const response = await api.put(`/patients/${patientId}`, patientData);
  return response.data;
}
