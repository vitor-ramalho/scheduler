import { Test, TestingModule } from '@nestjs/testing';
import { ProfessionalController } from './professional.controller';
import { ProfessionalService } from './professional.service';
import { ProfessionalDto } from './dto/professional.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

describe('ProfessionalController', () => {
  let controller: ProfessionalController;
  let service: ProfessionalService;

  const mockProfessional = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
    organization: { id: 'org-1' },
  };

  const mockJwtGuard = { canActivate: jest.fn().mockReturnValue(true) };

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
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtGuard)
      .compile();

    controller = module.get<ProfessionalController>(ProfessionalController);
    service = module.get<ProfessionalService>(ProfessionalService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a professional', async () => {
      const professionalDto: ProfessionalDto = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockProfessional as any);

      const result = await controller.create(professionalDto, 'org-1');

      expect(service.create).toHaveBeenCalledWith(professionalDto, 'org-1');
      expect(result).toEqual(mockProfessional);
    });
  });

  describe('findAll', () => {
    it('should return all professionals for an organization', async () => {
      jest
        .spyOn(service, 'findAll')
        .mockResolvedValue([mockProfessional] as any);

      const result = await controller.findAll('org-1');

      expect(service.findAll).toHaveBeenCalledWith('org-1');
      expect(result).toEqual([mockProfessional]);
    });
  });

  describe('update', () => {
    it('should update a professional', async () => {
      const updateData: Partial<ProfessionalDto> = { name: 'Updated Name' };
      const updatedProfessional = { ...mockProfessional, ...updateData };

      jest
        .spyOn(service, 'update')
        .mockResolvedValue(updatedProfessional as any);

      const result = await controller.update('1', updateData, 'org-1');

      expect(service.update).toHaveBeenCalledWith('1', updateData, 'org-1');
      expect(result).toEqual(updatedProfessional);
    });
  });

  describe('remove', () => {
    it('should remove a professional', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(mockProfessional as any);

      const result = await controller.remove('1', 'org-1');

      expect(service.remove).toHaveBeenCalledWith('1', 'org-1');
      expect(result).toEqual(mockProfessional);
    });
  });
});
