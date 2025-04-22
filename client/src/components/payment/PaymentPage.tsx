import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface PaymentPageProps {
  amount: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PaymentPage({ amount, onCancel }: PaymentPageProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/payment/create', {
        amount,
        orderId: `order_${Date.now()}`,
      });

      if (response.data.redirect_url) {
        window.location.href = response.data.redirect_url;
      } else {
        throw new Error('No redirect URL received');
      }
    } catch (error) {
      console.error('Payment creation failed:', error);
      toast.error('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
      <div className="w-full max-w-md">
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Total Amount:</p>
          <p className="text-2xl font-bold text-teal-600">
            R$ {amount}
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={handlePayment}
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-medium ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-teal-600 hover:bg-teal-700'
            }`}
          >
            {loading ? 'Processing...' : 'Pay with PIX'}
          </button>
          
          <button
            onClick={onCancel}
            disabled={loading}
            className="w-full py-3 rounded-lg text-gray-600 border border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>You will be redirected to AbacatePay to complete your payment</p>
        </div>
      </div>
    </div>
  );
} 