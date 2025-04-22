"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { register } from "@/services/authService";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const t = useTranslations("SignUp");
  const router = useRouter();

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
      await register(email, password, organizationName, firstName, lastName);
      toast({
        title: t("toasts.success.title"),
        description: t("toasts.success.description"),
      });
      router.push("/onboarding");
    } catch  {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
          {t("title")}
        </h2>
        <div className="space-y-4">
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
        <button
          onClick={handleSignUp}
          disabled={loading}
          className={`w-full mt-4 py-2 rounded ${
            loading
              ? "bg-teal-400 cursor-not-allowed"
              : "bg-teal-600 hover:bg-teal-700 text-white"
          }`}
        >
          {loading ? t("loading") : t("signUpButton")}
        </button>
        <p className="text-center mt-4 text-sm text-gray-600">
          {t("alreadyHaveAccount")}
          <Link href="/sign-in" className="text-teal-600 hover:underline">
            {t("signInLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
