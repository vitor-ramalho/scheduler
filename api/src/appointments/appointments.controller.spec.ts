import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { AppointmentDto } from './dto/appointment.dto';
import { NotFoundException } from '@nestjs/common';

describe('AppointmentsController', () => {
  let controller: AppointmentsController;
  let service: AppointmentsService;

  const mockAppointment: AppointmentDto = {
    id: '1',
    professionalId: 'prof1',
    clientId: 'client1',
    startTime: new Date(),
    endTime: new Date(),
    status: 'scheduled',
  };

  const updatedAppointment: AppointmentDto = {
    id: '1',
    professionalId: 'prof2',
    clientId: 'client2',
    startTime: new Date(),
    endTime: new Date(),
    status: 'confirmed',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [
        {
          provide: AppointmentsService,

          useValue: {
            findAll: jest.fn().mockResolvedValue([mockAppointment]),
            findOne: jest.fn().mockResolvedValue(mockAppointment),
            create: jest.fn().mockResolvedValue(mockAppointment),
            update: jest.fn().mockResolvedValue(mockAppointment),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<AppointmentsController>(AppointmentsController);
    service = module.get<AppointmentsService>(AppointmentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all appointments', async () => {
    expect(await controller.findAll()).toEqual([mockAppointment]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a specific appointment', async () => {
    expect(await controller.findOne('1')).toEqual(mockAppointment);
    expect(service.findOne).toHaveBeenCalledWith('1');
  });

  it('should create a new appointment', async () => {
    const createAppointmentDto: AppointmentDto = {
      professionalId: 'prof1',
      clientId: 'client1',
      startTime: new Date(),
      endTime: new Date(),
      status: 'scheduled',
    };
    expect(await controller.create(createAppointmentDto)).toEqual(mockAppointment);
    expect(service.create).toHaveBeenCalledWith(createAppointmentDto);
  });

  it('should update an existing appointment', async () => {
    const updateAppointmentDto: AppointmentDto = {
      professionalId: 'prof2',
      clientId: 'client2',
      startTime: new Date(),
      endTime: new Date(),
      status: 'confirmed',
    };
    jest.spyOn(service, 'update').mockResolvedValue(updatedAppointment);
    expect(await controller.update('1', updateAppointmentDto)).toEqual(updatedAppointment);
    expect(service.update).toHaveBeenCalledWith('1', updateAppointmentDto);
  });

  it('should delete an appointment', async () => {
    expect(await controller.remove('1')).toBeUndefined();
    expect(service.remove).toHaveBeenCalledWith('1');
  });

    it('should throw NotFoundException when appointment is not found', async () => {
    jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());
    await expect(controller.findOne('nonexistent')).rejects.toThrow(NotFoundException);
  });
});