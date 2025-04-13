import { Test, TestingModule } from '@nestjs/testing';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

describe('PlansController', () => {
  let controller: PlansController;
  let service: PlansService;

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

  it('should create a plan', async () => {
    const createPlanDto: CreatePlanDto = {
      name: 'Test Plan',
      description: 'A test plan',
      price: 100,
      features: ['feature1', 'feature2'],
    };
    const createdPlan = { id: '1', ...createPlanDto };
    (service.create as jest.Mock).mockResolvedValue(createdPlan);

    expect(await controller.create(createPlanDto)).toBe(createdPlan);
    expect(service.create).toHaveBeenCalledWith(createPlanDto);
  });

  it('should return all plans', async () => {
    const plans = [{ id: '1', name: 'Plan 1' }, { id: '2', name: 'Plan 2' }];
    (service.findAll as jest.Mock).mockResolvedValue(plans);

    expect(await controller.findAll()).toBe(plans);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a plan by id', async () => {
    const plan = { id: '1', name: 'Plan 1' };
    (service.findOne as jest.Mock).mockResolvedValue(plan);

    expect(await controller.findOne('1')).toBe(plan);
    expect(service.findOne).toHaveBeenCalledWith('1');
  });

  it('should update a plan', async () => {
    const updatePlanDto: UpdatePlanDto = { name: 'Updated Plan' };
    const updatedPlan = { id: '1', name: 'Updated Plan' };
    (service.update as jest.Mock).mockResolvedValue(updatedPlan);

    expect(await controller.update('1', updatePlanDto)).toBe(updatedPlan);
    expect(service.update).toHaveBeenCalledWith('1', updatePlanDto);
  });

  it('should delete a plan', async () => {
    (service.remove as jest.Mock).mockResolvedValue(undefined);

    expect(await controller.remove('1')).toBe(undefined);
    expect(service.remove).toHaveBeenCalledWith('1');
  });
});