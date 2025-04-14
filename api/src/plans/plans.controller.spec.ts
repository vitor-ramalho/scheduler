import { Test, TestingModule } from '@nestjs/testing';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';
import { PlanDto } from './dto/plan.dto';
import { Plan } from './entities/plan.entity';
import { HttpStatus } from '@nestjs/common';

describe('PlansController', () => {
  let controller: PlansController;
  let service: PlansService;

  const mockPlan: Plan = {
    id: 'plan-1',
    name: 'Basic Plan',
    description: 'Basic plan description',
    price: 0,
    features: ['feature1', 'feature2'],
    interval: 'monthly',
    organizations: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlansController],
      providers: [
        {
          provide: PlansService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PlansController>(PlansController);
    service = module.get<PlansService>(PlansService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new plan', async () => {
      const planDto: PlanDto = {
        name: 'Basic Plan',
        description: 'Basic plan description',
        price: 0,
        features: ['feature1', 'feature2'],
        interval: 'monthly',
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockPlan);

      const result = await controller.create(planDto);
      expect(result).toEqual(mockPlan);
      expect(service.create).toHaveBeenCalledWith(planDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of plans', async () => {
      const plans = [mockPlan];
      jest.spyOn(service, 'findAll').mockResolvedValue(plans);

      const result = await controller.findAll();
      expect(result).toEqual(plans);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a plan by id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockPlan);

      const result = await controller.findOne('plan-1');
      expect(result).toEqual(mockPlan);
      expect(service.findOne).toHaveBeenCalledWith('plan-1');
    });
  });

  describe('update', () => {
    it('should update a plan', async () => {
      const planDto: PlanDto = {
        name: 'Updated Plan',
        description: 'Updated description',
        price: 9.99,
        features: ['feature1', 'feature2', 'feature3'],
        interval: 'monthly',
      };

      const updatedPlan = { ...mockPlan, ...planDto };
      jest.spyOn(service, 'update').mockResolvedValue(updatedPlan);

      const result = await controller.update('plan-1', planDto);
      expect(result).toEqual(updatedPlan);
      expect(service.update).toHaveBeenCalledWith('plan-1', planDto);
    });
  });

  describe('remove', () => {
    it('should remove a plan', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(mockPlan);

      const result = await controller.remove('plan-1');
      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith('plan-1');
    });
  });
}); 