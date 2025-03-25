"use client";

import React, { useState } from "react";
import Link from "next/link";
import { login } from "@/services/authService";
import { useTranslations } from "next-intl";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const t = useTranslations("SignIn");

  const handleSignIn = async () => {
    try {
      await login(email, password);
      alert("Sign-in successful!");
    } catch (error) {
      alert("Sign-in failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">{t('title')}</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border rounded text-gray-600"
        />
        <input
          type="password"
          placeholder={t('password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border rounded text-gray-600"
        />
        <button
          onClick={handleSignIn}
          className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700"
        >
          {t('signInButton')}
        </button>
        <p className="text-center mt-4 text-sm text-gray-600">
          {t('noAccount')}
          <Link href="/sign-up" className="text-teal-600 hover:underline">
            {t('signUpLink')}
          </Link>
        </p>
      </div>
    </div>
  );
}
