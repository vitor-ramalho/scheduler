"use client";

import React, { useState } from "react";
import Link from "next/link";
import api from "@/services/apiService";
import { useTranslations } from "next-intl";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizationName, setOrganizationName] = useState("");

  const t = useTranslations("SignUp");

  const handleSignUp = async () => {
    try {
      await api.post("/auth/register", {
        email,
        password,
        organizationName,
      });
      alert("Sign-up successful! Please sign in.");
    } catch (error) {
      alert("Sign-up failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
          {t("title")}
        </h2>
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
          className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700"
        >
          {t("signUpButton")}
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
