"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { login } from "@/services/authService";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setLogin } = useAuth();
  const t = useTranslations("SignIn");

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const user = await login(email, password);
      setLogin(user.accessToken); // Redirect to dashboard
    } catch (err: any) {
      setError(err.message);
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
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
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
          onClick={handleSignIn}
          className={`w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
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
