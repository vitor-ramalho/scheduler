import { Test, TestingModule } from '@nestjs/testing';
import { ProfessionalController } from './professional.controller';
import { ProfessionalService } from './professional.service';

describe('ProfessionalController', () => {
  const mockProfessional = {id: 'any-id', name: 'any-name', phone: 'any-phone', email: 'any-email', identifier: 'any-identifier', organizationId: 'org-id'};
  const mockProfessionals = [mockProfessional, mockProfessional];
  let controller: ProfessionalController;
  let service: ProfessionalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfessionalController],
      providers: [
        {
          provide: ProfessionalService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockProfessional),
            findAll: jest.fn().mockResolvedValue(mockProfessionals),
            update: jest.fn().mockResolvedValue(mockProfessional),
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

  it('should create a professional', async () => {
    const professional = {name: 'any-name', phone: 'any-phone', email: 'any-email', identifier: 'any-identifier'};
    const result = await controller.create(professional, 'org-id');
    expect(result).toEqual(mockProfessional);
    expect(service.create).toHaveBeenCalled();
  });

  it('should return an array of professionals', async () => {
    const result = await controller.findAll('org-id');
    expect(result).toEqual(mockProfessionals);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should update a professional', async () => {
    const professional = {id: 'any-id', name: 'any-name', phone: 'any-phone', email: 'any-email', identifier: 'any-identifier', organizationId: 'org-id'};
    const result = await controller.update('any-id', professional, 'org-id');
    expect(result).toEqual(mockProfessional);
    expect(service.update).toHaveBeenCalled();
  });

  it('should delete a professional', async () => {
    const result = await controller.remove('any-id', 'org-id');
    expect(result).toBeUndefined();
    expect(service.remove).toHaveBeenCalled();
  });
});
