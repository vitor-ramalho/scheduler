import { Test, TestingModule } from '@nestjs/testing';
import { ProfessionalService } from './professional.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Professional } from './entities/professional.entity'; // Import the Professional entity
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common'; // Import NotFoundException
import { ProfessionalDto } from './dto/professional.dto'; // Import ProfessionalDto

describe('ProfessionalService', () => {
  const mockProfessional: ProfessionalDto = {name: "test", email:"test@mail.com"}
  const orgId = "org-id";
  let service: ProfessionalService;
  let repository: Repository<Professional>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfessionalService,
        {
          provide: getRepositoryToken(Professional),
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

    service = module.get<ProfessionalService>(ProfessionalService);
    repository = module.get<Repository<Professional>>(
      getRepositoryToken(Professional),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a professional', async () => {
      jest.spyOn(repository, 'create').mockReturnValue({ ...mockProfessional, id:"pro-id" } as Professional);
      jest.spyOn(repository, 'save').mockResolvedValue({ ...mockProfessional, id:"pro-id" } as Professional);

      const result = await service.create(mockProfessional, orgId);

      expect(repository.create).toHaveBeenCalledWith( { ...mockProfessional, organizationId: orgId });
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual({ ...mockProfessional, id:"pro-id" });
    });
  });

  describe('findAll', () => {
    it('should return all professionals for an organization', async () => {
      const professionals = [
        { id: '1', name: 'Professional 1', organizationId: orgId },
        { id: '2', name: 'Professional 2', organizationId: orgId },
      ] as Professional[];
      jest.spyOn(repository, 'find').mockResolvedValue(professionals);

      const result = await service.findAll(orgId);

      expect(repository.find).toHaveBeenCalledWith({
        where: { organizationId: orgId },
      });
      expect(result).toEqual(professionals);
    });
  });

  describe('findOne', () => {
    it('should find a professional by id and organizationId', async () => {
      const professional = {
        id: '1',
        name: 'Professional 1',
        organizationId: orgId,
      } as Professional;
      jest.spyOn(repository, 'findOne').mockResolvedValue(professional);

      const result = await service.findOne('1', orgId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '1', organizationId: orgId },
      });
      expect(result).toEqual(professional);
    });

    it('should throw NotFoundException if professional is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      await expect(service.findOne('1', orgId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a professional', async () => {
      const professionalId = '1';
      jest.spyOn(repository, 'remove').mockResolvedValue({} as Professional);

      const result = await service.remove(professionalId, orgId);

      expect(repository.remove).toHaveBeenCalled();
      expect(result).toEqual({ message: `Professional ${professionalId} removed.` });
    });
  });
});
