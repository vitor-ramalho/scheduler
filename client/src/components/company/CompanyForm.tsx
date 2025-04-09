import { formatCNPJ } from "@/utils/cnpjUtils";
import { formatPhoneInput } from "@/utils/utils";
import { useTranslations } from "next-intl";
import React from "react";

interface CompanyFormProps {
  companyInfo: {
    identifier: string;
    name: string;
    phone: string;
    email: string;
  };
  handleInputChange: (field: string, value: string) => void;
  errors: {
    identifier?: string;
    name?: string;
    phone?: string;
    email?: string;
  };
}

const CompanyForm = ({
  companyInfo,
  handleInputChange,
  errors,
}: CompanyFormProps) => {
  const t = useTranslations("Onboarding");
  return (
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
        onChange={(e) =>
          handleInputChange("phone", formatPhoneInput(e.target.value) || "")
        }
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
  );
};

export default CompanyForm;
