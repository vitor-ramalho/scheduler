import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { Appointment } from './entities/appointment.entity';
import { Client } from '../clients/entities/client.entity';

@Injectable()
export class SchedulingService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>, // Inject Client repository
  ) {}

  async createSchedule(scheduleData: Partial<Schedule>, organizationId: string) {
    const schedule = this.scheduleRepository.create({
      ...scheduleData,
      user: { organizationId },
    });
    return this.scheduleRepository.save(schedule);
  }

  async findSchedules(organizationId: string) {
    return this.scheduleRepository.find({
      where: { user: { organizationId } },
    });
  }

  async createAppointment(appointmentData: Partial<Appointment>, organizationId: string) {
    if (!appointmentData.schedule || !appointmentData.schedule.id) {
      throw new NotFoundException('Schedule is required for creating an appointment');
    }

    if (!appointmentData.client || !appointmentData.client.id) {
      throw new NotFoundException('Client is required for creating an appointment');
    }

    const schedule = await this.scheduleRepository.findOne({
      where: { id: appointmentData.schedule.id, isAvailable: true, user: { organizationId } },
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not available');
    }

    const client = await this.clientRepository.findOne({
      where: { id: appointmentData.client.id, organization: { id: organizationId } },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    schedule.isAvailable = false;
    await this.scheduleRepository.save(schedule);

    const appointment = this.appointmentRepository.create({
      ...appointmentData,
      client,
    });
    return this.appointmentRepository.save(appointment);
  }
}
