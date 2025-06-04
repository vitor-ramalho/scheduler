import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { IUser } from '@/services/authService';
import { getSubscriptionStatus, createSubscription, ICreateSubscriptionResponse } from '@/services/subscriptionService';
import { getPlans, IPlan } from '@/services/plansService';
import PlanCard from '../plans/PlanCard';

interface OnboardingProps {
  user: IUser;
}

export default function Onboarding({ user }: OnboardingProps) {
  const t = useTranslations('Onboarding');
  const router = useRouter();
  const [plans, setPlans] = useState<IPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<IPlan | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<ICreateSubscriptionResponse | null>(null);
  const [step, setStep] = useState<'select-plan' | 'payment' | 'confirmation'>('select-plan');

  useEffect(() => {
    async function checkSubscription() {
      try {
        // Skip if user is not logged in or no organization
        if (!user || !user.organization) {
          setLoading(false);
          return;
        }

        // Check if user already has an active plan
        const subscriptionStatus = await getSubscriptionStatus(user.organization.id);
        if (subscriptionStatus.organization.isPlanActive) {
          // User has active plan, redirect to dashboard
          router.push('/dashboard');
          return;
        }

        // Load available plans
        const availablePlans = await getPlans();
        setPlans(availablePlans);

        // Pre-select the current plan if it exists
        if (user.organization.plan) {
          const currentPlan = availablePlans.find(p => p.id === user.organization.plan.id);
          if (currentPlan) {
            setSelectedPlan(currentPlan);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Error checking subscription:', error);
        setLoading(false);
      }
    }

    checkSubscription();
  }, [user, router]);

  const handleSelectPlan = (plan: IPlan) => {
    setSelectedPlan(plan);
  };

  const handleContinue = async () => {
    if (!selectedPlan || !user || !user.organization) return;

    try {
      setLoading(true);
      
      // Create subscription with selected plan
      const subscription = await createSubscription(
        selectedPlan.id, 
        user.organization.id,
        user.id
      );
      
      setPaymentInfo(subscription);
      setStep('payment');
    } catch (error) {
      console.error('Error creating subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentComplete = () => {
    setStep('confirmation');
  };

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
        <p className="text-gray-600">
          {t('subtitle')}
        </p>
      </div>

      {step === 'select-plan' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan) => (
              <PlanCard 
                key={plan.id}
                plan={plan}
                isSelected={selectedPlan?.id === plan.id}
                onSelect={() => handleSelectPlan(plan)}
              />
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <button 
              className="px-6 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!selectedPlan}
              onClick={handleContinue}
            >
              {t('continueButton')}
            </button>
          </div>
        </>
      )}

      {step === 'payment' && paymentInfo && (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">{t('paymentTitle')}</h2>
          
          <div className="mb-6">
            <p className="mb-2"><strong>{t('selectedPlan')}:</strong> {selectedPlan?.name}</p>
            <p className="mb-2"><strong>{t('price')}:</strong> ${Number(selectedPlan?.price).toFixed(2)}/{selectedPlan?.interval}</p>
            <p className="mb-4"><strong>{t('expires')}:</strong> {new Date(paymentInfo.expiresAt).toLocaleString()}</p>
          </div>
          
          <div className="flex flex-col items-center mb-6">
            <h3 className="text-lg font-semibold mb-3">{t('scanQRCode')}</h3>
            <Image 
              src={`data:image/png;base64,${paymentInfo.brCodeBase64}`} 
              alt="Payment QR Code" 
              width={256}
              height={256}
              className="mb-4" 
            />
            <div className="bg-gray-100 p-3 rounded w-full text-center">
              <p className="text-xs break-all">{paymentInfo.brCode}</p>
            </div>
          </div>

          <div className="flex justify-between">
            <button 
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              onClick={() => setStep('select-plan')}
            >
              {t('backButton')}
            </button>
            <button 
              className="px-6 py-3 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition-colors"
              onClick={handlePaymentComplete}
            >
              {t('confirmPayment')}
            </button>
          </div>
        </div>
      )}

      {step === 'confirmation' && (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
          <div className="mb-6">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">{t('thankYou')}</h2>
            <p className="text-gray-600 mb-6">
              {t('confirmationMessage')}
            </p>
          </div>
          
          <button 
            className="px-6 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-colors"
            onClick={handleGoToDashboard}
          >
            {t('goToDashboard')}
          </button>
        </div>
      )}
    </div>
  );
}
