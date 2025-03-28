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
import { getClientByIdentifier } from "@/services/clientService";

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
  const [step, setStep] = useState(1);
  const [clientData, setClientData] = useState({
    name: "",
    email: "",
    identifier: "",
    phone: "",
  });
  const [appointmentData, setAppointmentData] = useState({
    date: "",
    time: "",
    consultationType: "",
    notes: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const { setAppointment } = useAppointmentStore();

  const validateClientData = () => {
    const newErrors: any = {};
    if (!clientData.identifier || clientData.identifier.length !== 11) {
      newErrors.identifier = "Identifier must be 11 digits.";
    }
    if (!clientData.name) {
      newErrors.name = "Name is required.";
    }
    if (!clientData.email || !/\S+@\S+\.\S+/.test(clientData.email)) {
      newErrors.email = "Valid email is required.";
    }
    if (!clientData.phone || clientData.phone.length !== 11) {
      newErrors.phone = "Phone must be 11 digits.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAppointmentData = () => {
    const newErrors: any = {};
    if (!appointmentData.date) {
      newErrors.date = "Date is required.";
    }
    if (!appointmentData.time) {
      newErrors.time = "Time is required.";
    }
    if (!appointmentData.consultationType) {
      newErrors.consultationType = "Consultation type is required.";
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
        console.log("Client data:", client);
        if (client) {
          setClientData({
            name: client.name,
            email: client.email,
            identifier: client.identifier,
            phone: client.phone || "",
          });
          toast({
            title: "Success",
            description: "Client found and data populated.",
          });
        } else {
          toast({
            title: "Info",
            description: "No client found with this identifier.",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch client data.",
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
    setStep(2);
  };

  const handleAppointmentSubmit = async () => {
    if (!validateAppointmentData()) return;
    setLoading(true);
    try {
      const response = await bookAppointment({
        ...appointmentData,
        clientId: "mock-client-id",
      });
      setAppointment(response);
      toast({
        title: "Success",
        description: "Appointment created successfully.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create appointment.",
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
            {step === 1 ? "Create or Select Client" : "Create Appointment"}
          </DialogTitle>
        </DialogHeader>
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Client Identifier (CPF)"
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
                placeholder="Client Name"
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
                placeholder="Client Email"
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
                placeholder="Phone (e.g., (31) 9 2002-5047)"
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
                placeholder="Date (YYYY-MM-DD)"
                type="date"
                value={appointmentData.date}
                onChange={(e) =>
                  setAppointmentData({
                    ...appointmentData,
                    date: e.target.value,
                  })
                }
                disabled={loading}
              />
              {errors.date && (
                <p className="text-red-500 text-sm">{errors.date}</p>
              )}
            </div>
            <div>
              <Input
                placeholder="Time (HH:MM)"
                type="time"
                value={appointmentData.time}
                onChange={(e) =>
                  setAppointmentData({
                    ...appointmentData,
                    time: e.target.value,
                  })
                }
                disabled={loading}
              />
              {errors.time && (
                <p className="text-red-500 text-sm">{errors.time}</p>
              )}
            </div>
            <div>
              <Input
                placeholder="Consultation Type"
                value={appointmentData.consultationType}
                onChange={(e) =>
                  setAppointmentData({
                    ...appointmentData,
                    consultationType: e.target.value,
                  })
                }
                disabled={loading}
              />
              {errors.consultationType && (
                <p className="text-red-500 text-sm">
                  {errors.consultationType}
                </p>
              )}
            </div>
            <div>
              <Input
                placeholder="Notes (Optional)"
                value={appointmentData.notes}
                onChange={(e) =>
                  setAppointmentData({
                    ...appointmentData,
                    notes: e.target.value,
                  })
                }
                disabled={loading}
              />
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
              {loading ? "Loading..." : "Next"}
            </Button>
          )}
          {step === 2 && (
            <>
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                Back
              </Button>
              <Button
                onClick={handleAppointmentSubmit}
                className="w-full"
                disabled={loading}
              >
                {loading ? "Loading..." : "Create Appointment"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
