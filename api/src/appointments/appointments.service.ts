import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { Client } from '../clients/entities/client.entity';
import { AppointmentDto } from './dto/appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>, // Inject Client repository
  ) {}

  async createAppointment(
    appointmentData: AppointmentDto,
    organizationId: string,
    professionalId: string,
  ) {
    console.log({ appointmentData });
    const client = await this.clientRepository.findOne({
      where: {
        id: appointmentData.clientId,
        organization: { id: organizationId },
      },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    const appointment = this.appointmentRepository.create({
      ...appointmentData,
      client,
      organization: {
        id: organizationId,
      },
      professional: {
        id: professionalId,
      },
    });
    return this.appointmentRepository.save(appointment);
  }

  async findAppointments(organizationId: string) {
    const appointments = await this.appointmentRepository.find({
      where: { client: { organization: { id: organizationId } } },
    });

    return appointments.map((appointment) => ({
      ...appointment,
      clientName: appointment.client.name,
      clientEmail: appointment.client.email,
    }));
  }

  async findAppointmentsByProfessional(
    organizationId: string,
    professionalId: string,
  ) {
    const appointments = await this.appointmentRepository.find({
      where: {
        organization: {
          id: organizationId,
        },
        professional: {
          id: professionalId,
        },
      },
    });

    if (appointments.length === 0) {
      throw new NotFoundException('Appointments not found');
    }

    return appointments;
  }
}
