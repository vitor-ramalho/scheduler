import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from './appointments.service';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let appointmentRepository: Repository<Appointment>;

  const mockAppointmentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };
  const mockAppointment: Appointment = {
    id: '1',
    professionalId: 'prof1',
    clientId: 'client1',
    organizationId: 'org1',
    date: new Date(),
    startTime: '09:00',
    endTime: '10:00',
    status: 'scheduled',
    notes: 'Test appointment',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        {
          provide: getRepositoryToken(Appointment),
          useValue: mockAppointmentRepository,
        },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    appointmentRepository = module.get<Repository<Appointment>>(
      getRepositoryToken(Appointment),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an appointment', async () => {
      mockAppointmentRepository.create.mockReturnValue(mockAppointment);
      mockAppointmentRepository.save.mockResolvedValue(mockAppointment);

      const result = await service.create({
        professionalId: 'prof1',
        clientId: 'client1',
        date: new Date(),
        startTime: '09:00',
        endTime: '10:00',
        notes: 'Test appointment',
      }, 'org1');

      expect(result).toEqual(mockAppointment);
    });

    it('should throw BadRequestException if there is a conflict', async () => {
      jest.spyOn(service, 'checkAvailability').mockResolvedValue(false);

      await expect(
        service.create({
          professionalId: 'prof1',
          clientId: 'client1',
          date: new Date(),
          startTime: '09:00',
          endTime: '10:00',
          notes: 'Test appointment',
        }, 'org1')
      ).rejects.toThrowError(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all appointments for an organization', async () => {
      const mockAppointments: Appointment[] = [mockAppointment];
      mockAppointmentRepository.find.mockResolvedValue(mockAppointments);

      const result = await service.findAll('org1');

      expect(result).toEqual(mockAppointments);
    });
  });

  describe('findOne', () => {
    it('should return an appointment by id', async () => {
      mockAppointmentRepository.findOne.mockResolvedValue(mockAppointment);

      const result = await service.findOne('1', 'org1');

      expect(result).toEqual(mockAppointment);
    });

    it('should throw NotFoundException if appointment is not found', async () => {    mockAppointmentRepository.findOne.mockResolvedValue(undefined);

      await expect(service.findOne('1', 'org1')).rejects.toThrowError(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an appointment', async () => {
      const updatedAppointment: Appointment = {
        ...mockAppointment,
        notes: 'Updated notes',
      };

      mockAppointmentRepository.findOne.mockResolvedValue(mockAppointment);
      mockAppointmentRepository.save.mockResolvedValue(updatedAppointment);

      const result = await service.update('1', 'org1', { notes: 'Updated notes' });

      expect(result).toEqual(updatedAppointment);
    });

    it('should throw NotFoundException if appointment is not found', async () => {
      mockAppointmentRepository.findOne.mockResolvedValue(undefined);

      await expect(service.update('1', 'org1', { notes: 'Updated notes' })).rejects.toThrowError(NotFoundException);
    });

    it('should throw BadRequestException if there is a conflict', async () => {
      mockAppointmentRepository.findOne.mockResolvedValue(mockAppointment);
      jest.spyOn(service, 'checkAvailability').mockResolvedValue(false);

      await expect(
        service.update('1', 'org1', {
          professionalId: 'prof2',
          date: new Date(),
          startTime: '10:00',
          endTime: '11:00',
        })
      ).rejects.toThrowError(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should remove an appointment', async () => {
      mockAppointmentRepository.findOne.mockResolvedValue(mockAppointment);
      mockAppointmentRepository.remove.mockResolvedValue(mockAppointment);

      const result = await service.remove('1', 'org1');

      expect(result).toEqual(mockAppointment);
    });

    it('should throw NotFoundException if appointment is not found', async () => {
      mockAppointmentRepository.findOne.mockResolvedValue(undefined);

      await expect(service.remove('1', 'org1')).rejects.toThrowError(NotFoundException);
    });
  });

  describe('checkAvailability', () => {
    it('should return true if there is no conflict', async () => {
      mockAppointmentRepository.find.mockResolvedValue([]);

      const result = await service.checkAvailability('prof1', new Date(), '09:00', '10:00', 'org1');

      expect(result).toBe(true);
    });

    it('should return false if there is a conflict', async () => {
      mockAppointmentRepository.find.mockResolvedValue([mockAppointment]);

      const result = await service.checkAvailability('prof1', new Date(), '09:00', '10:00', 'org1');

      expect(result).toBe(false);
    });
  });
});