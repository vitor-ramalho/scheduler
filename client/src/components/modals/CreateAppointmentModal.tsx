"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppointmentStore } from "@/store/appointmentStore";
import { bookAppointment } from "@/services/appointmentService";
import { toast } from "@/components/ui/use-toast";
import { getClientByIdentifier, addClient } from "@/services/clientService";
import { useTranslations } from "next-intl";

interface ClientData {
  id: string;
  identifier: string;
  name: string;
  phone: string;
  email: string;
}

interface AppointmentData {
  clientId: string;
  startDate: string;
  endDate: string;
  duration: number;
}

const formatPhoneInput = (phone: string) => {
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{2})(\d{1})(\d{4})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]} ${match[3]}-${match[4]}`;
  }
  return phone;
};

const formatIdentifierInput = (identifier: string) => {
  if (!identifier) return "";
  const cleaned = identifier?.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
  if (match) {
    return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
  }
  return identifier;
};

export default function CreateAppointmentModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("CreateAppointmentModal");
  const [step, setStep] = useState(1);
  const [clientData, setClientData] = useState<ClientData>({
    id: "",
    identifier: "",
    name: "",
    phone: "",
    email: "",
  });
  const [appointmentData, setAppointmentData] = useState<AppointmentData>({
    clientId: "",
    startDate: "",
    endDate: "",
    duration: 15, // Default duration
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { setAppointment } = useAppointmentStore();

  const validateClientData = () => {
    const newErrors: Record<string, string> = {};
    if (!clientData.identifier || clientData.identifier.length !== 11) {
      newErrors.identifier = t("errors.identifier");
    }
    if (!clientData.name) {
      newErrors.name = t("errors.name");
    }
    if (!clientData.email || !/\S+@\S+\.\S+/.test(clientData.email)) {
      newErrors.email = t("errors.email");
    }
    if (!clientData.phone || clientData.phone.length !== 11) {
      newErrors.phone = t("errors.phone");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAppointmentData = () => {
    const newErrors: Record<string, string> = {};
    if (!appointmentData.startDate) {
      newErrors.startDate = t("errors.date");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleIdentifierChange = async (formattedIdentifier: string) => {
    const rawIdentifier = formattedIdentifier.replace(/\D/g, "");
    if (rawIdentifier.length > 11) return;
    setClientData({ ...clientData, identifier: rawIdentifier });
    setErrors({ ...errors, identifier: undefined });
    if (rawIdentifier.length === 11) {
      setLoading(true);
      try {
        const client = await getClientByIdentifier(rawIdentifier);
        if (client) {
          setClientData({
            id: client.id,
            name: client.name,
            email: client.email,
            identifier: client.identifier,
            phone: client.phone || "",
          });
          toast({
            title: t("toasts.success.title"),
            description: t("toasts.success.description"),
          });
        } else {
          toast({
            title: t("toasts.info.title"),
            description: t("toasts.info.description"),
          });
        }
      } catch (error) {
        toast({
          title: t("toasts.error.title"),
          description: t("toasts.error.description"),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePhoneChange = (formattedPhone: string) => {
    const rawPhone = formattedPhone.replace(/\D/g, "");
    if (rawPhone.length > 11) return;
    setClientData({ ...clientData, phone: rawPhone });
    setErrors({ ...errors, phone: undefined });
  };

  const handleClientSubmit = async () => {
    if (!validateClientData()) return;

    if (!clientData.id) {
      // Create a new client if it doesn't exist
      setLoading(true);
      try {
        const newClient = await addClient({
          identifier: clientData.identifier,
          name: clientData.name,
          email: clientData.email,
          phone: clientData.phone,
        });
        setClientData((prev) => ({ ...prev, id: newClient.id }));
        setAppointmentData((prev) => ({ ...prev, clientId: newClient.id }));
        toast({
          title: t("toasts.success.title"),
          description: t("toasts.success.description"),
        });
      } catch (error) {
        toast({
          title: t("toasts.error.title"),
          description: t("toasts.error.description"),
          variant: "destructive",
        });
        return;
      } finally {
        setLoading(false);
      }
    } else {
      setAppointmentData((prev) => ({ ...prev, clientId: clientData.id }));
    }

    setStep(2);
  };

  const handleAppointmentSubmit = async () => {
    if (!validateAppointmentData()) return;

    // Calculate the endDate based on the selected duration
    const startDate = new Date(appointmentData.startDate);
    const endDate = new Date(
      startDate.getTime() + appointmentData.duration * 60000
    );
    setAppointmentData((prev) => ({
      ...prev,
      endDate: endDate.toISOString(),
    }));

    setLoading(true);
    try {
      const response = await bookAppointment({
        clientId: appointmentData.clientId,
        startDate: appointmentData.startDate,
        endDate: endDate.toISOString(),
      });
      setAppointment(response);
      toast({
        title: t("toasts.appointmentSuccess.title"),
        description: t("toasts.appointmentSuccess.description"),
      });
      onClose();
    } catch (error) {
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? t("titles.step1") : t("titles.step2")}
          </DialogTitle>
        </DialogHeader>
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Input
                placeholder={t("placeholders.identifier")}
                value={formatIdentifierInput(clientData.identifier)}
                onChange={(e) => handleIdentifierChange(e.target.value)}
                maxLength={14}
                disabled={loading}
              />
              {errors.identifier && (
                <p className="text-red-500 text-sm">{errors.identifier}</p>
              )}
            </div>
            <div>
              <Input
                placeholder={t("placeholders.name")}
                value={clientData.name}
                onChange={(e) =>
                  setClientData({ ...clientData, name: e.target.value })
                }
                disabled={loading}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>
            <div>
              <Input
                placeholder={t("placeholders.email")}
                type="email"
                value={clientData.email}
                onChange={(e) =>
                  setClientData({ ...clientData, email: e.target.value })
                }
                disabled={loading}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
            <div>
              <Input
                placeholder={t("placeholders.phone")}
                value={formatPhoneInput(clientData.phone)}
                onChange={(e) => handlePhoneChange(e.target.value)}
                maxLength={15}
                disabled={loading}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Input
                placeholder={t("placeholders.date")}
                type="datetime-local"
                value={appointmentData.startDate}
                onChange={(e) =>
                  setAppointmentData({
                    ...appointmentData,
                    startDate: e.target.value,
                  })
                }
                disabled={loading}
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm">{errors.startDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("placeholders.duration")}
              </label>
              <select
                value={appointmentData.duration}
                onChange={(e) =>
                  setAppointmentData({
                    ...appointmentData,
                    duration: parseInt(e.target.value, 10),
                  })
                }
                className="w-full p-2 border rounded"
                disabled={loading}
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
              </select>
            </div>
          </div>
        )}
        <DialogFooter>
          {step === 1 && (
            <Button
              onClick={handleClientSubmit}
              className="w-full"
              disabled={loading}
            >
              {loading ? t("buttons.loading") : t("buttons.next")}
            </Button>
          )}
          {step === 2 && (
            <>
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                {t("buttons.back")}
              </Button>
              <Button
                onClick={handleAppointmentSubmit}
                className="w-full"
                disabled={loading}
              >
                {loading
                  ? t("buttons.loading")
                  : t("buttons.createAppointment")}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
