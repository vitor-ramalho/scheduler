"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { validateCNPJ } from "@/utils/cnpjUtils"; // Import from utils
import { useUserStore } from "@/store/userStore";
import { updateCompany } from "@/services/onboardingService";
import { usePlanStore } from "@/store/planStore";
import PricingCard from "@/components/pricing-card";
import PaymentPage from "@/components/payment/PaymentPage";
import CompanyForm from "../company/CompanyForm";
import toast from "react-hot-toast";

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

interface CompanyInfo {
  identifier: string;
  name: string;
  phone: string;
  email: string;
  planId?: string;
}

interface ValidationErrors {
  identifier: string;
  name: string;
  phone: string;
  email: string;
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    identifier: "",
    name: "",
    phone: "",
    email: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({
    identifier: "",
    name: "",
    phone: "",
    email: "",
  });
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("Onboarding");

  const { user } = useUserStore();

  const { plans, fetchPlans } = usePlanStore();

  console.log(plans, "plans");

  const validateFields = () => {
    const newErrors: ValidationErrors = {
      identifier: "",
      name: "",
      phone: "",
      email: "",
    };

    if (step === 1) {
      if (!validateCNPJ(companyInfo.identifier)) {
        newErrors.identifier = t("invalidCNPJ");
      }
      if (!companyInfo.name) {
        newErrors.name = t("requiredField");
      }
      if (!companyInfo.phone) {
        newErrors.phone = t("requiredField");
      }
      if (!companyInfo.email || !/\S+@\S+\.\S+/.test(companyInfo.email)) {
        newErrors.email = t("invalidEmail");
      }
    }
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleNext = async () => {
    if (!validateFields()) return;

    setLoading(true);
    try {
      if (step === 1) {
        if (!user?.organization?.id) {
          toast.error("Organization ID is missing");
          return;
        }
        const updatedCompany = await updateCompany(user.organization.id, companyInfo);
        if (!updatedCompany) {
          toast.error("Failed to update company information");
          return;
        }
        setCompanyInfo(updatedCompany);
        setStep(step + 1);
      } else if (step === 2) {
        if (!selectedPlan) {
          toast.error("Please select a plan");
          return;
        }
        if (!user?.organization?.id) {
          toast.error("Organization ID is missing");
          return;
        }
        const updatedCompany = await updateCompany(user.organization.id, {
          ...companyInfo,
          planId: selectedPlan.id,
        });
        if (!updatedCompany) {
          toast.error("Failed to update plan");
          return;
        }
        setCompanyInfo(updatedCompany);
        setStep(step + 1);
      }
    } catch (error) {
      console.error("Error during API request:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CompanyInfo, value: string) => {
    setCompanyInfo({ ...companyInfo, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const handlePaymentSuccess = () => {
    router.push("/dashboard");
  };

  const handlePaymentCancel = () => {
    setStep(2);
  };

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-lg bg-white p-8 rounded shadow-lg">
        <h1 className="text-3xl font-bold text-center text-teal-600 mb-6">
          {t("title")}
        </h1>
        {step === 1 && (
          <CompanyForm
            companyInfo={companyInfo}
            handleInputChange={handleInputChange}
            errors={errors}
          />
        )}
        {step === 2 && (
          <div className="flex justify-center items-center">
            {plans.map((item) => (
              <PricingCard
                key={item.id}
                item={item}
                user={user}
                selectable={true}
                selectedPlan={selectedPlan}
                onSelect={(plan) => setSelectedPlan(plan)}
                onDeselect={() => setSelectedPlan(null)}
              />
            ))}
          </div>
        )}
        {step === 3 && selectedPlan && (
          <PaymentPage
            amount={selectedPlan.price}
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
          />
        )}
        {step !== 3 && (
          <button
            onClick={handleNext}
            disabled={loading}
            className={`w-full py-2 rounded mt-6 ${loading
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-teal-600 text-white hover:bg-teal-700"
              }`}
          >
            {loading ? t("loading") : t("nextButton")}
          </button>
        )}
      </div>
    </div>
  );
}
