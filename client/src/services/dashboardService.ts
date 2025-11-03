import api from './apiService';

interface DashboardStats {
  totalClients: number;
  totalProfessionals: number;
  todayAppointments: number;
  totalAppointments: number;
}

interface RecentAppointment {
  id: string;
  clientName: string;
  professionalName: string;
  startDate: string;
  endDate: string;
}

interface UpcomingAppointment {
  id: string;
  clientName: string;
  professionalName: string;
  startDate: string;
  endDate: string;
}

interface MonthlyStats {
  month: string;
  appointments: number;
}

class DashboardService {
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get('/dashboard/stats');
    return response.data;
  }

  async getRecentAppointments(): Promise<RecentAppointment[]> {
    const response = await api.get('/dashboard/recent-appointments');
    return response.data;
  }

  async getUpcomingAppointments(): Promise<UpcomingAppointment[]> {
    const response = await api.get('/dashboard/upcoming-appointments');
    return response.data;
  }

  async getMonthlyStats(): Promise<MonthlyStats[]> {
    const response = await api.get('/dashboard/monthly-stats');
    return response.data;
  }
}

export const dashboardService = new DashboardService();
export type { DashboardStats, RecentAppointment, UpcomingAppointment, MonthlyStats };