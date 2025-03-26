import { useState } from 'react';
import { addPatient, updatePatient } from '@/services/patientService';

export default function PatientForm({ patient, onSave }: { patient?: any; onSave: () => void }) {
  const [formData, setFormData] = useState(patient || { name: '', email: '', phone: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (patient) {
      await updatePatient(patient.id, formData);
    } else {
      await addPatient(formData);
    }
    onSave();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
      <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
      <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
      <button type="submit">Save</button>
    </form>
  );
}
