import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Client } from '../clients/entities/client.entity';
import { Professional } from '../professional/entities/professional.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Professional)
    private professionalRepository: Repository<Professional>,
  ) {}

  async getDashboardStats(organizationId: string) {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
    );

    const [
      totalClients,
      totalProfessionals,
      todayAppointments,
      totalAppointments,
    ] = await Promise.all([
      this.clientRepository.count({
        where: { organization: { id: organizationId } },
      }),
      this.professionalRepository.count({
        where: { organization: { id: organizationId } },
      }),
      this.appointmentRepository.count({
        where: {
          organization: { id: organizationId },
          startDate: Between(startOfDay, endOfDay),
        },
      }),
      this.appointmentRepository.count({
        where: { organization: { id: organizationId } },
      }),
    ]);

    return {
      totalClients,
      totalProfessionals,
      todayAppointments,
      totalAppointments,
    };
  }

  async getRecentAppointments(organizationId: string) {
    const appointments = await this.appointmentRepository.find({
      where: { organization: { id: organizationId } },
      order: { createdAt: 'DESC' },
      take: 5,
      relations: ['client', 'professional'],
    });

    return appointments.map((appointment) => ({
      id: appointment.id,
      clientName: appointment.client?.name || 'Unknown Client',
      professionalName:
        appointment.professional?.name || 'Unknown Professional',
      startDate: appointment.startDate,
      endDate: appointment.endDate,
    }));
  }

  async getUpcomingAppointments(organizationId: string) {
    const today = new Date();
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
    );

    const appointments = await this.appointmentRepository.find({
      where: {
        organization: { id: organizationId },
        startDate: Between(new Date(), endOfDay),
      },
      order: { startDate: 'ASC' },
      take: 10,
      relations: ['client', 'professional'],
    });

    return appointments.map((appointment) => ({
      id: appointment.id,
      clientName: appointment.client?.name || 'Unknown Client',
      professionalName:
        appointment.professional?.name || 'Unknown Professional',
      startDate: appointment.startDate,
      endDate: appointment.endDate,
    }));
  }

  async getMonthlyStats(organizationId: string) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Get last 6 months data
    const monthlyData: Array<{ month: string; appointments: number }> = [];

    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(currentYear, currentMonth - i, 1);
      const startOfMonth = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        1,
      );
      const endOfMonth = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth() + 1,
        0,
        23,
        59,
        59,
      );

      const appointmentCount = await this.appointmentRepository.count({
        where: {
          organization: { id: organizationId },
          startDate: Between(startOfMonth, endOfMonth),
        },
      });

      monthlyData.push({
        month: targetDate.toLocaleDateString('pt-BR', {
          month: 'short',
          year: 'numeric',
        }),
        appointments: appointmentCount,
      });
    }

    return monthlyData;
  }
}
