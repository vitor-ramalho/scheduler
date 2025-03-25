import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { Client } from '../clients/entities/client.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>, // Inject Client repository
  ) {}

  async createAppointment(appointmentData: Partial<Appointment>, organizationId: string) {
    if (!appointmentData.client || !appointmentData.client.id) {
      throw new NotFoundException('Client is required for creating an appointment');
    }

    const client = await this.clientRepository.findOne({
      where: { id: appointmentData.client.id, organization: { id: organizationId } },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    const appointment = this.appointmentRepository.create({
      ...appointmentData,
      client,
    });
    return this.appointmentRepository.save(appointment);
  }

  async findAppointments(organizationId: string) {
    return this.appointmentRepository.find({
      where: { client: { organization: { id: organizationId } } },
    });
  }
}
