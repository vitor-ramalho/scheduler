import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';

export default function PatientsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) {
    router.push('/sign-in');
    return null;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Patient Management</h1>
      <p>Search, view, and manage patient records.</p>
    </div>
  );
}
