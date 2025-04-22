"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { login } from "@/services/authService";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { setLogin } = useAuth();
  const t = useTranslations("SignIn");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!email || !/\S+@\S+\.\S+/.test(email)) newErrors.email = t("errors.email");
    if (!password) newErrors.password = t("errors.password");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    try {
      const user = await login(email, password);
      toast({
        title: t("toasts.success.title"),
        description: t("toasts.success.description"),
      });
      setLogin(user.accessToken); // Redirect to dashboard
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
          {t("title")}
        </h2>
        <div className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email"
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
          onClick={handleSignIn}
          className={`w-full mt-4 py-2 rounded ${
            loading
              ? "bg-teal-400 cursor-not-allowed"
              : "bg-teal-600 hover:bg-teal-700 text-white"
          }`}
          disabled={loading}
        >
          {loading ? t("loading") : t("signInButton")}
        </button>
        <p className="text-center mt-4 text-sm text-gray-600">
          {t("noAccount")}
          <Link href="/sign-up" className="text-teal-600 hover:underline">
            {t("signUpLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
