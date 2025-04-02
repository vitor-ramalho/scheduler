"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { register } from "@/services/authService";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const t = useTranslations("SignUp");
  const router = useRouter();

  const handleSignUp = async () => {
    setLoading(true);
    setError("");
    try {
      await register(email, password, organizationName);
      router.push("/onboarding");
    } catch (error: any) {
      setError(error.message);
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
        {error && (
          <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
        )}
        <input
          type="text"
          placeholder={t("organizationName")}
          value={organizationName}
          onChange={(e) => setOrganizationName(e.target.value)}
          className="w-full p-3 mb-4 border rounded text-gray-600"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border rounded text-gray-600"
        />
        <input
          type="password"
          placeholder={t("password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border rounded text-gray-600"
        />
        <button
          onClick={handleSignUp}
          disabled={loading}
          className={`w-full py-2 rounded ${
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
