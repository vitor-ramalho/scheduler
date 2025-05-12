"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Clock, User } from "lucide-react";

interface EventActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    id: string;
    clientName: string;
    start: Date;
    end: Date;
  };
}

export default function EventActionsModal({
  isOpen,
  onClose,
  event,
}: EventActionsModalProps) {
  const t = useTranslations("EventActionsModal");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="text-xl font-semibold text-gray-900">
            {t("appointmentDetails")}
          </div>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Client Info */}
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-teal-50 rounded-full">
              <User className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{event.clientName}</h3>
              <p className="text-sm text-gray-500">{t("customer")}</p>
            </div>
          </div>

          {/* Time Info */}
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-50 rounded-full">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {event.start.toLocaleTimeString("pt-BR", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}{" "}
                -{" "}
                {event.end.toLocaleTimeString("pt-BR", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </h3>
              <p className="text-sm text-gray-500">
                {event.start.toLocaleDateString("pt-BR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col space-y-3 pt-4">
            <Button className="w-full bg-teal-600 hover:bg-teal-700">
              {t("reschedule")}
            </Button>
            <Button variant="outline" className="w-full">
              {t("editDetails")}
            </Button>
            <Button variant="destructive" className="w-full">
              {t("cancelAppointment")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 