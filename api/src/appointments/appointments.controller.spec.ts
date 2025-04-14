import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { AppointmentDto } from './dto/appointment.dto';
import { NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

describe('AppointmentsController', () => {
  let controller: AppointmentsController;
  let service: AppointmentsService;

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

  const mockJwtGuard = { canActivate: jest.fn().mockReturnValue(true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [
        {
          provide: AppointmentsService,
          useValue: {
            createAppointment: jest.fn(),
            findAppointments: jest.fn(),
            findAppointmentsByProfessional: jest.fn(),
          },
        },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue(mockJwtGuard)
    .compile();

    controller = module.get<AppointmentsController>(AppointmentsController);
    service = module.get<AppointmentsService>(AppointmentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createAppointment', () => {
    it('should create an appointment', async () => {
      const appointmentDto: AppointmentDto = {
        clientId: 'client-1',
        startDate: new Date(),
        endDate: new Date()
      };

      jest.spyOn(service, 'createAppointment').mockResolvedValue(mockAppointment as any);

      const result = await controller.createAppointment(
        appointmentDto,
        'professional-1',
        'org-1'
      );

      expect(service.createAppointment).toHaveBeenCalledWith(
        appointmentDto,
        'org-1',
        'professional-1'
      );
      expect(result).toEqual(mockAppointment);
    });

    it('should throw NotFoundException when client is not found', async () => {
      const appointmentDto: AppointmentDto = {
        clientId: 'nonexistent',
        startDate: new Date(),
        endDate: new Date()
      };

      jest.spyOn(service, 'createAppointment').mockRejectedValue(
        new NotFoundException('Client not found')
      );

      await expect(
        controller.createAppointment(appointmentDto, 'professional-1', 'org-1')
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAppointments', () => {
    it('should return all appointments for an organization', async () => {
      jest.spyOn(service, 'findAppointments').mockResolvedValue([mockAppointment] as any);

      const result = await controller.findAppointments('org-1');

      expect(service.findAppointments).toHaveBeenCalledWith('org-1');
      expect(result).toEqual([mockAppointment]);
    });
  });

  describe('findAppointmentsByProfessional', () => {
    it('should return appointments for a specific professional', async () => {
      jest.spyOn(service, 'findAppointmentsByProfessional').mockResolvedValue([mockAppointment] as any);

      const result = await controller.findAppointmentsByProfessional('org-1', 'professional-1');

      expect(service.findAppointmentsByProfessional).toHaveBeenCalledWith('org-1', 'professional-1');
      expect(result).toEqual([mockAppointment]);
    });

    it('should throw NotFoundException when appointments are not found', async () => {
      jest.spyOn(service, 'findAppointmentsByProfessional').mockRejectedValue(
        new NotFoundException('Appointments not found')
      );

      await expect(
        controller.findAppointmentsByProfessional('org-1', 'nonexistent')
      ).rejects.toThrow(NotFoundException);
    });
  });
}); 