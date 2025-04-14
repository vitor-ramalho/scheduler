import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from './appointments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { Client } from '../clients/entities/client.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { AppointmentDto } from './dto/appointment.dto';

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let appointmentRepository: Repository<Appointment>;
  let clientRepository: Repository<Client>;

  const mockAppointment = {
    id: '1',
    startDate: new Date(),
    endDate: new Date(),
    client: { 
      id: 'client-1',
      name: 'John Doe',
      email: 'john@example.com'
    },
    professional: { id: 'professional-1' },
    organization: { id: 'org-1' }
  };

  const mockClient = {
    id: 'client-1',
    name: 'John Doe',
    email: 'john@example.com',
    organization: { id: 'org-1' }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        {
          provide: getRepositoryToken(Appointment),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Client),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    appointmentRepository = module.get<Repository<Appointment>>(getRepositoryToken(Appointment));
    clientRepository = module.get<Repository<Client>>(getRepositoryToken(Client));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAppointment', () => {
    it('should create an appointment', async () => {
      const appointmentDto: AppointmentDto = {
        clientId: 'client-1',
        startDate: new Date(),
        endDate: new Date()
      };

      jest.spyOn(clientRepository, 'findOne').mockResolvedValue(mockClient as Client);
      jest.spyOn(appointmentRepository, 'create').mockReturnValue(mockAppointment as Appointment);
      jest.spyOn(appointmentRepository, 'save').mockResolvedValue(mockAppointment as Appointment);

      const result = await service.createAppointment(appointmentDto, 'org-1', 'professional-1');

      expect(clientRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: appointmentDto.clientId,
          organization: { id: 'org-1' },
        },
      });
      expect(appointmentRepository.create).toHaveBeenCalledWith({
        ...appointmentDto,
        client: mockClient,
        organization: { id: 'org-1' },
        professional: { id: 'professional-1' },
      });
      expect(result).toEqual(mockAppointment);
    });

    it('should throw NotFoundException when client is not found', async () => {
      const appointmentDto: AppointmentDto = {
        clientId: 'nonexistent',
        startDate: new Date(),
        endDate: new Date()
      };

      jest.spyOn(clientRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.createAppointment(appointmentDto, 'org-1', 'professional-1')
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAppointments', () => {
    it('should return all appointments for an organization', async () => {
      const appointments = [mockAppointment];
      jest.spyOn(appointmentRepository, 'find').mockResolvedValue(appointments as Appointment[]);

      const result = await service.findAppointments('org-1');

      expect(appointmentRepository.find).toHaveBeenCalledWith({
        where: { client: { organization: { id: 'org-1' } } },
      });
      expect(result).toEqual(appointments.map(appointment => ({
        ...appointment,
        clientName: appointment.client.name,
        clientEmail: appointment.client.email,
      })));
    });
  });

  describe('findAppointmentsByProfessional', () => {
    it('should return appointments for a specific professional', async () => {
      const appointments = [mockAppointment];
      jest.spyOn(appointmentRepository, 'find').mockResolvedValue(appointments as Appointment[]);

      const result = await service.findAppointmentsByProfessional('org-1', 'professional-1');

      expect(appointmentRepository.find).toHaveBeenCalledWith({
        where: {
          organization: { id: 'org-1' },
          professional: { id: 'professional-1' },
        },
      });
      expect(result).toEqual(appointments);
    });

    it('should throw NotFoundException when appointments are not found', async () => {
      jest.spyOn(appointmentRepository, 'find').mockResolvedValue([]);

      await expect(
        service.findAppointmentsByProfessional('org-1', 'nonexistent')
      ).rejects.toThrow(NotFoundException);
    });
  });
}); 