import { Test, TestingModule } from '@nestjs/testing';
import { ProfessionalController } from './professional.controller';
import { ProfessionalService } from './professional.service';

describe('ProfessionalController', () => {
  let controller: ProfessionalController;
  let service: ProfessionalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfessionalController],
      providers: [
        {
          provide: ProfessionalService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProfessionalController>(ProfessionalController);
    service = module.get<ProfessionalService>(ProfessionalService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Add tests for create, findAll, update, and remove methods
});
