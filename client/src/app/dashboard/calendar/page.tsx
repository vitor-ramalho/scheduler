import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';

export default function CalendarPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) {
    router.push('/sign-in');
    return null;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Calendar</h1>
      <p>Here you can view and manage your daily and weekly schedules.</p>
    </div>
  );
}
