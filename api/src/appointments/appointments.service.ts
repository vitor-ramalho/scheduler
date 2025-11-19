import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { Client } from '../clients/entities/client.entity';
import { AppointmentDto } from './dto/appointment.dto';
import { EmailService } from '../notification/email.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly emailService: EmailService,
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

    const savedAppointment = await this.appointmentRepository.save(appointment);

    // Load full appointment with relations for email
    const fullAppointment = await this.appointmentRepository.findOne({
      where: { id: savedAppointment.id },
      relations: ['client', 'professional', 'organization'],
    });

    // Send emails (won't block if they fail)
    if (fullAppointment) {
      this.sendAppointmentEmails(fullAppointment).catch((error) => {
        console.error('Error sending appointment emails:', error);
      });
    }

    return savedAppointment;
  }

  // Send appointment emails asynchronously
  private async sendAppointmentEmails(appointment: Appointment): Promise<void> {
    try {
      const appointmentDate = new Date(appointment.startDate);
      const dateStr = appointmentDate.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const timeStr = appointmentDate.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });

      // Send confirmation to client
      await this.emailService.sendAppointmentConfirmation({
        clientEmail: appointment.client.email,
        clientName: appointment.client.name,
        professionalName: appointment.professional.name,
        date: dateStr,
        time: timeStr,
        organizationName: appointment.organization.name,
        organizationPhone: appointment.organization.phone,
        organizationEmail: appointment.organization.email,
      });

      // Send notification to professional (only if email is available)
      if (appointment.professional.email) {
        await this.emailService.sendProfessionalNotification({
          professionalEmail: appointment.professional.email,
          professionalName: appointment.professional.name,
          clientName: appointment.client.name,
          date: dateStr,
          time: timeStr,
          organizationName: appointment.organization.name,
          organizationPhone: appointment.organization.phone,
          organizationEmail: appointment.organization.email,
        });
      }
    } catch (error) {
      console.error('Error in sendAppointmentEmails:', error);
      // Don't throw - emails failing shouldn't break appointment creation
    }
  }

  async findAppointments(organizationId: string) {
    const appointments = await this.appointmentRepository.find({
      where: { organization: { id: organizationId } },
      relations: ['client', 'professional'],
    });

    return appointments.map((appointment) => ({
      ...appointment,
      clientName: appointment.client?.name || 'Cliente não encontrado',
      clientEmail: appointment.client?.email || '',
      professionalName:
        appointment.professional?.name || 'Profissional não encontrado',
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
      relations: ['client', 'professional'],
    });

    // Retorna lista vazia se não houver agendamentos, não um erro
    return appointments;
  }
}
