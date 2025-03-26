import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';

export default function BookAppointmentPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) {
    router.push('/sign-in');
    return null;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Book Appointment</h1>
      <p>Schedule new appointments for patients.</p>
    </div>
  );
}
