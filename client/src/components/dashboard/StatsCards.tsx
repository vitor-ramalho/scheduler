'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Calendar, CalendarDays } from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalClients: number;
    totalProfessionals: number;
    todayAppointments: number;
    totalAppointments: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total de Clientes",
      value: stats.totalClients,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Profissionais",
      value: stats.totalProfessionals,
      icon: UserCheck,
      color: "text-green-600",
    },
    {
      title: "Agendamentos Hoje",
      value: stats.todayAppointments,
      icon: Calendar,
      color: "text-teal-600",
    },
    {
      title: "Total de Agendamentos",
      value: stats.totalAppointments,
      icon: CalendarDays,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}