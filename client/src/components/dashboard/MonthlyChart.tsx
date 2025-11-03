'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface MonthlyStats {
  month: string;
  appointments: number;
}

interface MonthlyChartProps {
  data: MonthlyStats[];
}

export function MonthlyChart({ data }: MonthlyChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-teal-600" />
            Agendamentos por Mês
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            Dados não disponíveis
          </p>
        </CardContent>
      </Card>
    );
  }

  const maxAppointments = Math.max(...data.map(item => item.appointments));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-teal-600" />
          Agendamentos por Mês
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="text-sm font-medium text-gray-700 min-w-[80px]">
                  {item.month}
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                  <div
                    className="bg-teal-600 h-4 rounded-full transition-all duration-300"
                    style={{
                      width: `${maxAppointments > 0 ? (item.appointments / maxAppointments) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
              <span className="text-sm font-bold text-gray-900 ml-3">
                {item.appointments}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}