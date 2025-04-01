"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";
import api from "@/services/apiService";
import { useProfessionalStore } from "@/store/professionalStore";
import { formatPhoneInput } from "@/utils/utils";

interface Professional {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export default function ProfessionalsPage() {
  const t = useTranslations("ProfessionalsPage");
  const { professionals, fetchProfessionals } = useProfessionalStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProfessional, setCurrentProfessional] = useState<
    Partial<Professional>
  >({
    id: "",
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfessionals();
  }, [fetchProfessionals]);

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

  const handleInputChange = (field: keyof Professional, value: string) => {
    setCurrentProfessional((prev) => ({
      ...prev,
      [field]: field === "phone" ? value.replace(/\D/g, "") : value,
    }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
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
    } catch (error) {
      toast({
        title: t("toasts.error.title"),
        description: t("toasts.error.save"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await api.delete(`/professionals/${id}`);
      toast({
        title: t("toasts.success.title"),
        description: t("toasts.success.remove"),
      });
      fetchProfessionals();
    } catch (error) {
      toast({
        title: t("toasts.error.title"),
        description: t("toasts.error.remove"),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 flex-1 overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Button
          onClick={() => {
            setCurrentProfessional({
              id: "",
              name: "",
              email: "",
              phone: "",
            });
            setIsModalOpen(true);
          }}
        >
          {t("buttons.addProfessional")}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b text-left">
                {t("table.name")}
              </th>
              <th className="px-4 py-2 border-b text-left">
                {t("table.email")}
              </th>
              <th className="px-4 py-2 border-b text-left">
                {t("table.phone")}
              </th>
              <th className="px-4 py-2 border-b text-left">
                {t("table.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {professionals.map((professional) => (
              <tr key={professional.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border-b">{professional.name}</td>
                <td className="px-4 py-2 border-b">
                  {professional.email || t("table.noEmail")}
                </td>
                <td className="px-4 py-2 border-b">
                  {professional.phone || t("table.noPhone")}
                </td>
                <td className="px-4 py-2 border-b">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCurrentProfessional(professional);
                        setIsModalOpen(true);
                      }}
                    >
                      {t("buttons.edit")}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleRemove(professional.id)}
                    >
                      {t("buttons.remove")}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentProfessional.id
                ? t("modal.editTitle")
                : t("modal.createTitle")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Input
                placeholder={t("placeholders.name")}
                value={currentProfessional.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={loading}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>
            <div>
              <Input
                placeholder={t("placeholders.email")}
                value={currentProfessional.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
            <div>
              <Input
                placeholder={t("placeholders.phone")}
                maxLength={15}
                value={formatPhoneInput(currentProfessional.phone) || ""}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={loading}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
