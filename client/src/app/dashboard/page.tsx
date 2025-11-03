'use client';

import { useEffect, useState } from 'react';
import { dashboardService, DashboardStats, RecentAppointment, UpcomingAppointment, MonthlyStats } from '@/services/dashboardService';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { RecentAppointments } from '@/components/dashboard/RecentAppointments';
import { UpcomingAppointments } from '@/components/dashboard/UpcomingAppointments';
import { MonthlyChart } from '@/components/dashboard/MonthlyChart';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentAppointments, setRecentAppointments] = useState<RecentAppointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<UpcomingAppointment[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsData, recentData, upcomingData, monthlyData] = await Promise.all([
          dashboardService.getDashboardStats(),
          dashboardService.getRecentAppointments(),
          dashboardService.getUpcomingAppointments(),
          dashboardService.getMonthlyStats(),
        ]);

        setStats(statsData);
        setRecentAppointments(recentData);
        setUpcomingAppointments(upcomingData);
        setMonthlyStats(monthlyData);
      } catch (err) {
        setError('Erro ao carregar dados do dashboard');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do seu negócio</p>
      </div>

      {stats && <StatsCards stats={stats} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingAppointments appointments={upcomingAppointments} />
        <RecentAppointments appointments={recentAppointments} />
      </div>

      <MonthlyChart data={monthlyStats} />
    </div>
  );
}
