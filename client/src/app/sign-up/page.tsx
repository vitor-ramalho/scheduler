"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { register } from "@/services/authService";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { translateError } from "@/utils/errorTranslations";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationIdentifier, setOrganizationIdentifier] = useState("");
  const [organizationPhone, setOrganizationPhone] = useState("");
  const [organizationEmail, setOrganizationEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");

  const t = useTranslations("SignUp");
  const locale = useLocale();
  const router = useRouter();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Campos pessoais
    if (!firstName.trim()) newErrors.firstName = t("errors.firstName");
    if (!lastName.trim()) newErrors.lastName = t("errors.lastName");
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = t("errors.email");
    if (!password || password.length < 8) newErrors.password = t("errors.password");
    
    // Campos da organização
    if (!organizationName.trim()) newErrors.organizationName = t("errors.organizationName");
    if (!organizationIdentifier.trim()) newErrors.organizationIdentifier = t("errors.organizationIdentifier");
    if (!organizationPhone.trim()) newErrors.organizationPhone = t("errors.organizationPhone");
    if (!organizationEmail.trim() || !/\S+@\S+\.\S+/.test(organizationEmail)) {
      newErrors.organizationEmail = t("errors.organizationEmail");
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    setServerError("");
    
    try {
      await register({
        email,
        password,
        firstName,
        lastName,
        organizationName,
        organizationIdentifier,
        organizationPhone,
        organizationEmail,
      });
      
      toast({
        title: t("toasts.success.title"),
        description: t("toasts.success.description"),
      });
      
      router.push("/dashboard");
    } catch (error: unknown) {
      console.error("Signup error:", error);
      
      // Capturar mensagem específica do backend
      let errorMessage = t("toasts.error.description");
      
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        if (apiError.response?.data?.message) {
          const backendMessage = apiError.response.data.message;
          errorMessage = translateError(backendMessage, locale);
        }
      }
      
      setServerError(errorMessage);
      
      toast({
        title: t("toasts.error.title"),
        description: errorMessage,
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
        
        {/* Erro do servidor */}
        {serverError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {serverError}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder={t("firstName")}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-3 border rounded text-gray-600"
              disabled={loading}
              required
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
              required
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
              required
            />
            {errors.organizationName && (
              <p className="text-red-500 text-sm">{errors.organizationName}</p>
            )}
          </div>
          
          <div>
            <Input
              type="text"
              placeholder={t("organizationIdentifier")}
              value={organizationIdentifier}
              onChange={(e) => setOrganizationIdentifier(e.target.value)}
              className="w-full p-3 border rounded text-gray-600"
              disabled={loading}
              required
            />
            {errors.organizationIdentifier && (
              <p className="text-red-500 text-sm">{errors.organizationIdentifier}</p>
            )}
          </div>
          
          <div>
            <Input
              type="tel"
              placeholder={t("organizationPhone")}
              value={organizationPhone}
              onChange={(e) => setOrganizationPhone(e.target.value)}
              className="w-full p-3 border rounded text-gray-600"
              disabled={loading}
              required
            />
            {errors.organizationPhone && (
              <p className="text-red-500 text-sm">{errors.organizationPhone}</p>
            )}
          </div>
          
          <div>
            <Input
              type="email"
              placeholder={t("organizationEmail")}
              value={organizationEmail}
              onChange={(e) => setOrganizationEmail(e.target.value)}
              className="w-full p-3 border rounded text-gray-600"
              disabled={loading}
              required
            />
            {errors.organizationEmail && (
              <p className="text-red-500 text-sm">{errors.organizationEmail}</p>
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
              required
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
              required
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
          {t("alreadyHaveAccount")} {" "}
          <Link href="/sign-in" className="text-teal-600 hover:underline">
            {t("signInLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}