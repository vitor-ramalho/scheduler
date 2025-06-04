"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { register } from "@/services/authService";
import { getPlans, IPlan } from "@/services/plansService";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import PlanCard from "@/components/plans/PlanCard";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [plans, setPlans] = useState<IPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const t = useTranslations("SignUp");
  const router = useRouter();

  useEffect(() => {
    const fetchPlans = async () => {
      setLoadingPlans(true);
      try {
        const plansData = await getPlans();
        setPlans(plansData);

        // Set the free plan as default if available
        const freePlan = plansData.find((plan) => plan.name === "Free");
        if (freePlan) {
          setSelectedPlanId(freePlan.id);
        }
      } catch (error) {
        console.error("Failed to load plans:", error);
        toast({
          title: "Error",
          description: "Failed to load available plans. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPlans();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!firstName) newErrors.firstName = t("errors.firstName");
    if (!lastName) newErrors.lastName = t("errors.lastName");
    if (!organizationName) newErrors.organizationName = t("errors.organizationName");
    if (!email || !/\S+@\S+\.\S+/.test(email)) newErrors.email = t("errors.email");
    if (!password || password.length < 8) newErrors.password = t("errors.password");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    try {
      await register(email, password, organizationName, firstName, lastName, selectedPlanId);
      toast({
        title: t("toasts.success.title"),
        description: t("toasts.success.description"),
      });
      router.push("/onboarding");
    } catch {
      toast({
        title: t("toasts.error.title"),
        description: t("toasts.error.description"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
      <div className="w-full max-w-4xl bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
          {t("title")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Account Information</h3>
            <div>
              <Input
                type="text"
                placeholder={t("firstName")}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-3 border rounded text-gray-600"
                disabled={loading}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">{errors.firstName}</p>
              )}
            </div>
            <div>
              <Input
                type="text"
                placeholder={t("lastName")}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-3 border rounded text-gray-600"
                disabled={loading}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">{errors.lastName}</p>
              )}
            </div>
            <div>
              <Input
                type="text"
                placeholder={t("organizationName")}
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="w-full p-3 border rounded text-gray-600"
                disabled={loading}
              />
              {errors.organizationName && (
                <p className="text-red-500 text-sm">{errors.organizationName}</p>
              )}
            </div>
            <div>
              <Input
                type="email"
                placeholder={t("email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded text-gray-600"
                disabled={loading}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div>
              <Input
                type="password"
                placeholder={t("password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded text-gray-600"
                disabled={loading}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Choose a Plan</h3>
            {loadingPlans ? (
              <div className="flex justify-center items-center h-64">
                <p>Loading plans...</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {plans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    isSelected={selectedPlanId === plan.id}
                    onSelect={() => setSelectedPlanId(plan.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleSignUp}
          disabled={loading}
          className={`w-full mt-8 py-3 rounded-md font-medium ${
            loading
              ? "bg-teal-400 cursor-not-allowed"
              : "bg-teal-600 hover:bg-teal-700 text-white"
          }`}
        >
          {loading ? t("loading") : t("signUpButton")}
        </button>

        <p className="text-center mt-4 text-sm text-gray-600">
          {t("alreadyHaveAccount")}{" "}
          <Link href="/sign-in" className="text-teal-600 hover:underline">
            {t("signInLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
