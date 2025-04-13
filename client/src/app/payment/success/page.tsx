"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('payment_id');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await fetch(`/api/payment/status/${paymentId}`);
        const data = await response.json();

        if (data.status === 'completed') {
          toast.success('Payment completed successfully!');
          router.push('/dashboard');
        } else {
          toast.error('Payment verification failed');
          router.push('/onboarding');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        toast.error('Failed to verify payment');
        router.push('/onboarding');
      }
    };

    if (paymentId) {
      verifyPayment();
    } else {
      router.push('/onboarding');
    }
  }, [paymentId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-teal-600 mb-4">
          Verifying Payment
        </h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">
          Please wait while we verify your payment...
        </p>
      </div>
    </div>
  );
} 