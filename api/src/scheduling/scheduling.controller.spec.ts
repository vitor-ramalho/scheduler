import { Test, TestingModule } from '@nestjs/testing';
import { SchedulingController } from './scheduling.controller';
import { SchedulingService } from './scheduling.service';

describe('SchedulingController', () => {
  let controller: SchedulingController;
  let service: SchedulingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchedulingController],
      providers: [
        {
          provide: SchedulingService,
          useValue: {
            createSchedule: jest.fn(),
            findSchedules: jest.fn(),
            createAppointment: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SchedulingController>(SchedulingController);
    service = module.get<SchedulingService>(SchedulingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createSchedule', () => {
    it('should call service.createSchedule with organizationId and return the result', async () => {
      const scheduleData = { title: 'Test Schedule', startTime: new Date(), endTime: new Date(), isAvailable: true };
      const createdSchedule = { id: '1', ...scheduleData };

      jest.spyOn(service, 'createSchedule').mockResolvedValue(createdSchedule as any);

      const result = await controller.createSchedule(scheduleData, 'org-id');

      expect(service.createSchedule).toHaveBeenCalledWith(scheduleData, 'org-id');
      expect(result).toEqual(createdSchedule);
    });
  });

  describe('findSchedules', () => {
    it('should call service.findSchedules with organizationId and return the result', async () => {
      const userId = 'user-id';
      const schedules = [{ id: '1', title: 'Test Schedule', startTime: new Date(), endTime: new Date(), isAvailable: true }];

      jest.spyOn(service, 'findSchedules').mockResolvedValue(schedules as any);

      const result = await controller.findSchedules('org-id');

      expect(service.findSchedules).toHaveBeenCalledWith('org-id');
      expect(result).toEqual(schedules);
    });
  });

  describe('createAppointment', () => {
    it('should call service.createAppointment with organizationId and return the result', async () => {
      const appointmentData = {
        clientName: 'John Doe',
        clientEmail: 'john@example.com',
        schedule: {
          id: '1',
          title: 'Test Schedule',
          startTime: new Date(),
          endTime: new Date(),
          isAvailable: true,
          user: {
            id: 'user-id',
            email: 'user@example.com',
            firstName: 'User',
            lastName: 'Example',
            password: 'hashed-password',
            role: 'user',
            isActive: true,
            organizationId: 'org-id',
            organization: {
              id: 'org-id',
              name: 'Test Org',
              slug: 'test-org',
              plan: 'basic',
              isActive: true,
              users: [],
              clients: [],
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            schedules: [],
            appointments: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        client: {
          id: 'client-id',
          name: 'John Doe',
          email: 'john@example.com',
          organization: {
            id: 'org-id',
            name: 'Test Org',
            slug: 'test-org',
            plan: 'basic',
            isActive: true,
            users: [],
            clients: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          appointments: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
      const createdAppointment = { id: '1', ...appointmentData };

      jest.spyOn(service, 'createAppointment').mockResolvedValue(createdAppointment as any);

      const result = await controller.createAppointment(appointmentData, 'org-id');

      expect(service.createAppointment).toHaveBeenCalledWith(appointmentData, 'org-id');
      expect(result).toEqual(createdAppointment);
    });
  });
});
