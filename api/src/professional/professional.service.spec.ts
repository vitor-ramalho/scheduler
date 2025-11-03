import { Test, TestingModule } from '@nestjs/testing';
import { ProfessionalService } from './professional.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Professional } from './entities/professional.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ProfessionalDto } from './dto/professional.dto';

describe('ProfessionalService', () => {
  let service: ProfessionalService;
  let repository: Repository<Professional>;

  const mockProfessional = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
    organization: { id: 'org-1' },
  };

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
      const professionalDto: ProfessionalDto = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
      };

      jest.spyOn(repository, 'create').mockReturnValue(mockProfessional as any);
      jest.spyOn(repository, 'save').mockResolvedValue(mockProfessional as any);

      const result = await service.create(professionalDto, 'org-1');

      expect(repository.create).toHaveBeenCalledWith({
        ...professionalDto,
        organization: { id: 'org-1' },
      });
      expect(repository.save).toHaveBeenCalledWith(mockProfessional);
      expect(result).toEqual(mockProfessional);
    });
  });

  describe('findAll', () => {
    it('should return all professionals for an organization', async () => {
      jest
        .spyOn(repository, 'find')
        .mockResolvedValue([mockProfessional] as any);

      const result = await service.findAll('org-1');

      expect(repository.find).toHaveBeenCalledWith({
        where: { organization: { id: 'org-1' } },
      });
      expect(result).toEqual([mockProfessional]);
    });
  });

  describe('update', () => {
    it('should update a professional', async () => {
      const updateData: Partial<ProfessionalDto> = { name: 'Updated Name' };
      const updatedProfessional = { ...mockProfessional, ...updateData };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(mockProfessional as any);
      jest
        .spyOn(repository, 'save')
        .mockResolvedValue(updatedProfessional as any);

      const result = await service.update('1', updateData, 'org-1');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '1', organization: { id: 'org-1' } },
      });
      expect(repository.save).toHaveBeenCalledWith(updatedProfessional);
      expect(result).toEqual(updatedProfessional);
    });

    it('should throw NotFoundException when professional is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(
        service.update('nonexistent', { name: 'Updated Name' }, 'org-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a professional', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(mockProfessional as any);
      jest
        .spyOn(repository, 'remove')
        .mockResolvedValue(mockProfessional as any);

      const result = await service.remove('1', 'org-1');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '1', organization: { id: 'org-1' } },
      });
      expect(repository.remove).toHaveBeenCalledWith(mockProfessional);
      expect(result).toEqual(mockProfessional);
    });

    it('should throw NotFoundException when professional is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.remove('nonexistent', 'org-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
