import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlansService } from './plans.service';
import { Plan } from './entities/plan.entity';
import { NotFoundException } from '@nestjs/common';

describe('PlansService', () => {
  let service: PlansService;
  let repository: Repository<Plan>;

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
      providers: [
        PlansService,
        {
          provide: getRepositoryToken(Plan),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PlansService>(PlansService);
    repository = module.get<Repository<Plan>>(getRepositoryToken(Plan));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a new plan', async () => {
      const planData = {
        name: 'Basic Plan',
        description: 'Basic plan description',
        price: 0,
        features: ['feature1', 'feature2'],
        interval: 'monthly',
      };

      jest.spyOn(repository, 'create').mockReturnValue(mockPlan);
      jest.spyOn(repository, 'save').mockResolvedValue(mockPlan);

      const result = await service.create(planData);
      expect(result).toEqual(mockPlan);
      expect(repository.create).toHaveBeenCalledWith(planData);
      expect(repository.save).toHaveBeenCalledWith(mockPlan);
    });
  });

  describe('findAll', () => {
    it('should return an array of plans', async () => {
      const plans = [mockPlan];
      jest.spyOn(repository, 'find').mockResolvedValue(plans);

      const result = await service.findAll();
      expect(result).toEqual(plans);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a plan if found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockPlan);

      const result = await service.findOne('plan-1');
      expect(result).toEqual(mockPlan);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'plan-1' },
      });
    });

    it('should throw NotFoundException if plan not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('plan-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the plan', async () => {
      const updateData = {
        name: 'Updated Plan',
      };

      const updatedPlan = { ...mockPlan, ...updateData };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockPlan);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedPlan);

      const result = await service.update('plan-1', updateData);
      expect(result).toEqual(updatedPlan);
      expect(repository.save).toHaveBeenCalledWith(updatedPlan);
    });

    it('should throw NotFoundException if plan not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(service.update('plan-1', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove the plan', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockPlan);
      jest.spyOn(repository, 'remove').mockResolvedValue(mockPlan);

      const result = await service.remove('plan-1');
      expect(result).toEqual(mockPlan);
      expect(repository.remove).toHaveBeenCalledWith(mockPlan);
    });

    it('should throw NotFoundException if plan not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(service.remove('plan-1')).rejects.toThrow(NotFoundException);
    });
  });
}); 