"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function PaymentCancelPage() {
  const router = useRouter();

  useEffect(() => {
    toast.error('Payment was cancelled');
    router.push('/onboarding');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Payment Cancelled
        </h1>
        <p className="text-gray-600">
          Redirecting you back to the onboarding process...
        </p>
      </div>
    </div>
  );
} 