import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsService } from './organizations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Plan } from '../plans/entities/plan.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { OrganizationDto } from './dto/organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

describe('OrganizationsService', () => {
  let service: OrganizationsService;
  let organizationRepository: Repository<Organization>;
  let planRepository: Repository<Plan>;

  const mockOrganization = {
    id: '1',
    name: 'Test Organization',
    email: 'test@example.com',
    plan: { id: 'plan-1' }
  };

  const mockPlan = {
    id: 'plan-1',
    name: 'Basic Plan'
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationsService,
        {
          provide: getRepositoryToken(Organization),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Plan),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrganizationsService>(OrganizationsService);
    organizationRepository = module.get<Repository<Organization>>(
      getRepositoryToken(Organization),
    );
    planRepository = module.get<Repository<Plan>>(
      getRepositoryToken(Plan),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an organization', async () => {
      const organizationDto: OrganizationDto = {
        name: 'Test Organization',
        email: 'test@example.com',
        planId: 'plan-1'
      };

      jest.spyOn(organizationRepository, 'create').mockReturnValue(mockOrganization as any);
      jest.spyOn(organizationRepository, 'save').mockResolvedValue(mockOrganization as any);

      const result = await service.create(organizationDto);

      expect(organizationRepository.create).toHaveBeenCalledWith({
        ...organizationDto,
        plan: { id: organizationDto.planId }
      });
      expect(organizationRepository.save).toHaveBeenCalledWith(mockOrganization);
      expect(result).toEqual(mockOrganization);
    });
  });

  describe('findAll', () => {
    it('should return all organizations', async () => {
      jest.spyOn(organizationRepository, 'find').mockResolvedValue([mockOrganization] as any);

      const result = await service.findAll();

      expect(organizationRepository.find).toHaveBeenCalled();
      expect(result).toEqual([mockOrganization]);
    });
  });

  describe('findById', () => {
    it('should return an organization by id', async () => {
      jest.spyOn(organizationRepository, 'findOne').mockResolvedValue(mockOrganization as any);

      const result = await service.findById('1');

      expect(organizationRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' }
      });
      expect(result).toEqual(mockOrganization);
    });

    it('should throw NotFoundException when organization is not found', async () => {
      jest.spyOn(organizationRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an organization', async () => {
      const updateData: UpdateOrganizationDto = {
        name: 'Updated Organization'
      };
      const updatedOrganization = { ...mockOrganization, ...updateData };

      jest.spyOn(organizationRepository, 'findOne').mockResolvedValue(mockOrganization as any);
      jest.spyOn(organizationRepository, 'save').mockResolvedValue(updatedOrganization as any);

      const result = await service.update('1', updateData);

      expect(organizationRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' }
      });
      expect(organizationRepository.save).toHaveBeenCalledWith(updatedOrganization);
      expect(result).toEqual(updatedOrganization);
    });

    it('should update an organization with a new plan', async () => {
      const updateData: UpdateOrganizationDto = {
        name: 'Updated Organization',
        planId: 'plan-2'
      };
      const newPlan = { ...mockPlan, id: 'plan-2' };
      const updatedOrganization = { ...mockOrganization, ...updateData, plan: newPlan };

      jest.spyOn(organizationRepository, 'findOne').mockResolvedValue(mockOrganization as any);
      jest.spyOn(planRepository, 'findOne').mockResolvedValue(newPlan as any);
      jest.spyOn(organizationRepository, 'save').mockResolvedValue(updatedOrganization as any);

      const result = await service.update('1', updateData);

      expect(organizationRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' }
      });
      expect(planRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'plan-2' }
      });
      expect(organizationRepository.save).toHaveBeenCalledWith(updatedOrganization);
      expect(result).toEqual(updatedOrganization);
    });

    it('should throw NotFoundException when organization is not found', async () => {
      jest.spyOn(organizationRepository, 'findOne').mockResolvedValue(null);

      await expect(service.update('nonexistent', { name: 'Updated' })).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when plan is not found', async () => {
      jest.spyOn(organizationRepository, 'findOne').mockResolvedValue(mockOrganization as any);
      jest.spyOn(planRepository, 'findOne').mockResolvedValue(null);

      await expect(service.update('1', { planId: 'nonexistent' })).rejects.toThrow(NotFoundException);
    });
  });
}); 