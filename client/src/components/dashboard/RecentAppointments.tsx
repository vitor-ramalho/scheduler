'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface RecentAppointment {
  id: string;
  clientName: string;
  professionalName: string;
  startDate: string;
  endDate: string;
}

interface RecentAppointmentsProps {
  appointments: RecentAppointment[];
}

export function RecentAppointments({ appointments }: RecentAppointmentsProps) {
  if (appointments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Agendamentos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            Nenhum agendamento encontrado
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agendamentos Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between border-b pb-3 last:border-b-0"
            >
              <div className="flex-1">
                <h4 className="font-medium">{appointment.clientName}</h4>
                <p className="text-sm text-gray-600">
                  com {appointment.professionalName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  {format(new Date(appointment.startDate), "dd/MM", {
                    locale: ptBR,
                  })}
                </p>
                <p className="text-xs text-gray-500">
                  {format(new Date(appointment.startDate), "HH:mm", {
                    locale: ptBR,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}