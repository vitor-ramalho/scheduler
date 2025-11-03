'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock } from "lucide-react";

interface UpcomingAppointment {
  id: string;
  clientName: string;
  professionalName: string;
  startDate: string;
  endDate: string;
}

interface UpcomingAppointmentsProps {
  appointments: UpcomingAppointment[];
}

export function UpcomingAppointments({ appointments }: UpcomingAppointmentsProps) {
  if (appointments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-teal-600" />
            Próximos Agendamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            Nenhum agendamento para hoje
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-teal-600" />
          Próximos Agendamentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="text-center">
                  <p className="text-lg font-bold text-teal-600">
                    {format(new Date(appointment.startDate), "HH:mm", {
                      locale: ptBR,
                    })}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(appointment.endDate), "HH:mm", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">
                  {appointment.clientName}
                </h4>
                <p className="text-sm text-gray-600 truncate">
                  {appointment.professionalName}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}