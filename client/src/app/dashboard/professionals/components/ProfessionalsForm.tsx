'use client'

import { formatPhoneInput } from "@/utils/utils";
import { Professional } from "./ProfessionalsPage";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import api from "@/services/apiService";
import { toast } from "@/components/ui/use-toast";
import { useProfessionalStore } from "@/store/professionalStore";

interface ProfessionalsFormProps {
  currentProfessional: Professional;
  setCurrentProfessional: (value: React.SetStateAction<Professional>) => void
  setIsModalOpen: (value: React.SetStateAction<boolean>) => void
}

const ProfessionalsForm = ({
  currentProfessional,
  setCurrentProfessional,
  setIsModalOpen
}: ProfessionalsFormProps) => {
  const t = useTranslations("ProfessionalsPage");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [loading, setLoading] = useState(false);

  const { fetchProfessionals } = useProfessionalStore()

  const validateProfessional = () => {
    const newErrors: Record<string, string> = {};
    if (!currentProfessional.name) newErrors.name = t("errors.name");
    if (
      currentProfessional.email &&
      !/\S+@\S+\.\S+/.test(currentProfessional.email)
    )
      newErrors.email = t("errors.email");
    if (
      currentProfessional.phone &&
      !/^\+?\d{10,15}$/.test(currentProfessional.phone)
    )
      newErrors.phone = t("errors.phone");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSave = async () => {
    if (!validateProfessional()) return;

    setLoading(true);
    try {
      if (currentProfessional.id) {
        await api.put(
          `/professionals/${currentProfessional.id}`,
          currentProfessional
        );
        toast({
          title: t("toasts.success.title"),
          description: t("toasts.success.update"),
        });
      } else {
        await api.post("/professionals", currentProfessional);
        toast({
          title: t("toasts.success.title"),
          description: t("toasts.success.create"),
        });
      }
      setIsModalOpen(false);
      fetchProfessionals();
    } catch {
      toast({
        title: t("toasts.error.title"),
        description: t("toasts.error.save"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Professional, value: string) => {
    setCurrentProfessional((prev) => ({
      ...prev,
      [field]: field === "phone" ? value.replace(/\D/g, "") : value,
    }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <>
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
            value={currentProfessional.phone && formatPhoneInput(currentProfessional.phone) || ""}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            disabled={loading}
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
          {t("buttons.cancel")}
        </Button>
        <Button onClick={handleSave} disabled={loading}>
          {t("buttons.save")}
        </Button>
      </DialogFooter>
    </>
  );
};

export default ProfessionalsForm;
