import { Test, TestingModule } from '@nestjs/testing';
import { PlansService } from './plans.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { Repository } from 'typeorm';
import { CreatePlanDto } from './dto/plan.dto';

describe('PlansService', () => {
  let service: PlansService;
  let repository: Repository<Plan>;

  const mockPlan: Plan = {
    id: 'plan-id',
    name: 'Basic Plan',
    description: 'A basic plan',
    price: 10,
    features: ['feature1', 'feature2'],
    createdAt: new Date(),
    updatedAt: new Date(),
    organizations: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlansService,
        {
          provide: getRepositoryToken(Plan),
          useValue: {
            find: jest.fn().mockResolvedValue([mockPlan]),
            findOne: jest.fn().mockResolvedValue(mockPlan),
            create: jest.fn().mockReturnValue(mockPlan),
            save: jest.fn().mockResolvedValue(mockPlan),
            remove: jest.fn().mockResolvedValue(undefined),
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

  it('should return all plans', async () => {
    expect(await service.findAll()).toEqual([mockPlan]);
    expect(repository.find).toHaveBeenCalled();
  });

  it('should return a plan by id', async () => {
    expect(await service.findOne('plan-id')).toEqual(mockPlan);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'plan-id' } });
  });

  it('should create a plan', async () => {
    const createPlanDto: CreatePlanDto = {
      name: 'Basic Plan',
      description: 'A basic plan',
      price: 10,
      features: ['feature1', 'feature2'],
    };
    expect(await service.create(createPlanDto)).toEqual(mockPlan);
    expect(repository.create).toHaveBeenCalledWith(createPlanDto);
    expect(repository.save).toHaveBeenCalledWith(mockPlan);
  });

  it('should update a plan', async () => {
    const updatePlanDto: Partial<CreatePlanDto> = {
      description: 'An updated basic plan',
    };
    const updatedPlan: Plan = { ...mockPlan, ...updatePlanDto };
    jest.spyOn(repository, 'save').mockResolvedValue(updatedPlan);

    expect(await service.update('plan-id', updatePlanDto)).toEqual(updatedPlan);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'plan-id' } });
    expect(repository.save).toHaveBeenCalledWith(updatedPlan);
  });

  it('should delete a plan', async () => {
    expect(await service.remove('plan-id')).toBeUndefined();
    expect(repository.remove).toHaveBeenCalledWith(mockPlan);
  });
});