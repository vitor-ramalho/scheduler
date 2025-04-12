import { formatPhoneInput } from "@/utils/utils";
import { Professional } from "./ProfessionalsPage";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

interface ProfessionalsFormProps {
  currentProfessional: Professional;
  loading: boolean;
  errors: Record<string, string>;
  handleInputChange: (field: keyof Professional, value: string) => void;
}

const ProfessionalsForm = ({
  currentProfessional,
  loading,
  errors,
  handleInputChange,
}: ProfessionalsFormProps) => {
  const t = useTranslations("ProfessionalsPage");

  return (
    <div className="space-y-4">
      <div>
        <Input
          placeholder={t("placeholders.name")}
          value={currentProfessional.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
          disabled={loading}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>
      <div>
        <Input
          placeholder={t("placeholders.email")}
          value={currentProfessional.email || ""}
          onChange={(e) => handleInputChange("email", e.target.value)}
          disabled={loading}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>
      <div>
        <Input
          placeholder={t("placeholders.phone")}
          maxLength={15}
          value={formatPhoneInput(currentProfessional.phone) || ""}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          disabled={loading}
        />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
      </div>
    </div>
  );
};

export default ProfessionalsForm;
