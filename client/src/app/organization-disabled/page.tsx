"use client";

import { AlertTriangle, Mail, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";

export default function OrganizationDisabled() {
  const { setLogout } = useAuth();
  const t = useTranslations("OrganizationDisabled");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-6">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {t("description")}
          </p>

          {/* Status */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              <span className="text-sm font-medium text-yellow-800">
                {t("status")}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {/* Contact Support */}
            <a
              href="mailto:suporte@agendador.com"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
            >
              <Mail className="h-4 w-4 mr-2" />
              {t("contactSupport")}
            </a>

            {/* Logout */}
            <button
              onClick={() => setLogout()}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("logout")}
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              {t("additionalInfo")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}