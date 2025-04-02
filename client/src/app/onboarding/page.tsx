"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { formatCNPJ, validateCNPJ } from "@/utils/cnpjUtils"; // Import from utils
import { useUserStore } from "@/store/userStore";
import { updateCompany } from "@/services/onboardingService";
import { usePlanStore } from "@/store/planStore";
import PricingCard from "@/components/pricing-card";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [companyInfo, setCompanyInfo] = useState({
    identifier: "",
    name: "",
    phone: "",
    email: "",
  });
  const [errors, setErrors] = useState({
    identifier: "",
    name: "",
    phone: "",
    email: "",
  });
  const [selectedPlan, setSelectedPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("Onboarding");

  const { user } = useUserStore();

  const { plans, fetchPlans } = usePlanStore();

  console.log(plans, "plans");

  const mockApiRequest = (endpoint: string, data: any) => {
    return new Promise((resolve) => {
      console.log(`Mock API Request to ${endpoint} with data:`, data);
      setTimeout(resolve, 1000); // Simulate network delay
    });
  };

  const validateFields = () => {
    const newErrors: any = {};
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
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateFields()) return;

    setLoading(true);
    try {
      if (step === 1) {
        if (user) await updateCompany(user?.organization.id, companyInfo);
      } else if (step === 2) {
        await updateCompany(user?.organization.id, {
          ...companyInfo,
          planId: selectedPlan.id,
        });
      } else if (step === 3) {
        await mockApiRequest("/organizations/complete-onboarding", {});
        router.push("/dashboard");
      }
      setStep(step + 1);
    } catch (error) {
      console.error("Error during API request:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCompanyInfo({ ...companyInfo, [field]: value });
    setErrors({ ...errors, [field]: "" }); // Clear error for the field
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-lg bg-white p-8 rounded shadow-lg">
        <h1 className="text-3xl font-bold text-center text-teal-600 mb-6">
          {t("title")}
        </h1>
        {step === 1 && (
          <div>
            <input
              type="text"
              placeholder={t("companyIdentifier")}
              value={companyInfo.identifier}
              onChange={(e) =>
                handleInputChange("identifier", formatCNPJ(e.target.value))
              }
              className={`w-full p-3 mb-2 border rounded text-gray-600 ${
                errors.identifier ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.identifier && (
              <p className="text-red-500 text-sm mb-4">{errors.identifier}</p>
            )}
            <input
              type="text"
              placeholder={t("companyName")}
              value={companyInfo.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`w-full p-3 mb-2 border rounded text-gray-600 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mb-4">{errors.name}</p>
            )}
            <input
              type="text"
              placeholder={t("phone")}
              value={companyInfo.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className={`w-full p-3 mb-2 border rounded text-gray-600 ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mb-4">{errors.phone}</p>
            )}
            <input
              type="email"
              placeholder={t("email")}
              value={companyInfo.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`w-full p-3 mb-2 border rounded text-gray-600 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mb-4">{errors.email}</p>
            )}
          </div>
        )}
        {step === 2 && (
          <>
            {plans.map((item) => (
              <PricingCard
                key={item.id}
                item={item}
                user={user}
                selectable={true}
                selectedPlan={selectedPlan}
                onSelect={(planId) => setSelectedPlan(planId)}
                onDeselect={() => setSelectedPlan("")}
              />
            ))}
          </>
        )}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {t("step3Title")}
            </h2>
            <p className="text-gray-600">{t("step3Description")}</p>
          </div>
        )}
        <button
          onClick={handleNext}
          disabled={loading}
          className={`w-full py-2 rounded mt-6 ${
            loading
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-teal-600 text-white hover:bg-teal-700"
          }`}
        >
          {loading
            ? t("loading")
            : step === 3
            ? t("finishButton")
            : t("nextButton")}
        </button>
      </div>
    </div>
  );
}
