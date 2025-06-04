import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface PaymentData {
  id: string;
  amount: number;
  status: string;
  brCode?: string;
  brCodeBase64?: string;
  expiresAt?: string;
}

interface PaymentPageProps {
  amount: number;
  paymentData?: PaymentData; // Optional payment data from subscription
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PaymentPage({ amount, paymentData, onSuccess, onCancel }: PaymentPageProps) {
  const [loading, setLoading] = useState(false);
  const t = useTranslations('Payment');

  // Function to check payment status
  const checkPaymentStatus = async (paymentId: string) => {
    try {
      const response = await fetch(`/api/subscriptions/status/${paymentId}`);
      const data = await response.json();
      
      if (data.organization?.isPlanActive) {
        toast.success(t('paymentSuccessful'));
        if (onSuccess) onSuccess();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking payment status:', error);
      return false;
    }
  };

  // Handle manual verification after payment
  const handleVerifyPayment = async () => {
    if (!paymentData?.id) {
      toast.error(t('noPaymentId'));
      return;
    }
    
    setLoading(true);
    const success = await checkPaymentStatus(paymentData.id);
    
    if (!success) {
      toast.error(t('paymentPending'));
    }
    
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">{t('paymentDetails')}</h2>
      
      {paymentData ? (
        // Show QR code if payment data is available from subscription
        <div className="w-full max-w-md">
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">{t('totalAmount')}:</p>
            <p className="text-2xl font-bold text-teal-600">
              R$ {amount}
            </p>
            {paymentData.expiresAt && (
              <p className="text-sm text-gray-500 mt-2">
                {t('expiresAt')}: {new Date(paymentData.expiresAt).toLocaleString()}
              </p>
            )}
          </div>
          
          <div className="flex flex-col items-center mb-6">
            <h3 className="text-lg font-semibold mb-3">{t('scanQRCode')}</h3>
            {paymentData.brCodeBase64 && (
              <div className="w-64 h-64 mb-4 relative">
                <Image 
                  src={`data:image/png;base64,${paymentData.brCodeBase64}`}
                  alt="Payment QR Code"
                  fill
                  style={{objectFit: 'contain'}}
                />
              </div>
            )}
            {paymentData.brCode && (
              <div className="bg-gray-100 p-3 rounded w-full text-center">
                <p className="text-xs break-all">{paymentData.brCode}</p>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <button
              onClick={handleVerifyPayment}
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-medium ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-teal-600 hover:bg-teal-700'
              }`}
            >
              {loading ? t('verifying') : t('verifyPayment')}
            </button>
            
            <button
              onClick={onCancel}
              disabled={loading}
              className="w-full py-3 rounded-lg text-gray-600 border border-gray-300 hover:bg-gray-50"
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      ) : (
        // Fall back to regular payment if no payment data is provided
        <div className="w-full max-w-md">
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">{t('totalAmount')}:</p>
            <p className="text-2xl font-bold text-teal-600">
              R$ {amount}
            </p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={onCancel}
              className="w-full py-3 rounded-lg text-gray-600 border border-gray-300 hover:bg-gray-50"
            >
              {t('cancel')}
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>{t('redirectMessage')}</p>
          </div>
        </div>
      )}
    </div>
  );
} 