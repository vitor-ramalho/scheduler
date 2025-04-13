"use client";

import OnboardingPage from "@/components/pages/OnboardingPage";
import convertToSubcurrency from "@/utils/convertToSubcurrency";
import { Elements, CheckoutPage } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Onboarding() {
  const amount = 59.99;
  return (
    <>
      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: convertToSubcurrency(amount),
          currency: "brl",
          payment_method_types: ['pix'],
        }}
      >
        <OnboardingPage />
      </Elements>
    </>
  );
}
