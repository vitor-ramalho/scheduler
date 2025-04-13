import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsService } from './organizations.service';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateOrganizationDto } from './dto/organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

describe('OrganizationsService', () => {
  let service: OrganizationsService;
  let repository: Repository<Organization>;

  const mockOrganization: Organization = {
    id: 'org-id',
    name: 'Test Organization',
    slug: 'test-organization',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    plan: {
      id: 'plan-id',
      name: 'Test Plan',
      price: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      description: '',
      features: [],
    },
    users: [],
    clients: [],
    professionals: [],
    appointments: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationsService,
        {
          provide: getRepositoryToken(Organization),
          useValue: {
            find: jest.fn().mockResolvedValue([mockOrganization]),
            findOne: jest.fn().mockResolvedValue(mockOrganization),
            create: jest.fn().mockReturnValue(mockOrganization),
            save: jest.fn().mockResolvedValue(mockOrganization),
            merge: jest.fn().mockReturnValue(mockOrganization),
            softDelete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<OrganizationsService>(OrganizationsService);
    repository = module.get<Repository<Organization>>(getRepositoryToken(Organization));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all organizations', async () => {
    expect(await service.findAll()).toEqual([mockOrganization]);
    expect(repository.find).toHaveBeenCalled();
  });

  it('should return a organization by id', async () => {
    expect(await service.findOne('org-id')).toEqual(mockOrganization);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'org-id' }, relations: ['plan'] });
  });

  it('should create a organization', async () => {
    const createOrganizationDto: CreateOrganizationDto = {
      name: 'New Organization',
      planId: 'plan-id',
    };
    expect(await service.create(createOrganizationDto)).toEqual(mockOrganization);
    expect(repository.create).toHaveBeenCalledWith({
      name: 'New Organization',
      slug: 'new-organization',
      plan: { id: 'plan-id' },
    });
    expect(repository.save).toHaveBeenCalledWith(mockOrganization);
  });

  it('should update a organization', async () => {
    const updateOrganizationDto: UpdateOrganizationDto = {
      name: 'Updated Organization',
    };
    expect(await service.update('org-id', updateOrganizationDto)).toEqual(mockOrganization);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'org-id' }, relations: ['plan'] });
    expect(repository.merge).toHaveBeenCalledWith(mockOrganization, updateOrganizationDto);
    expect(repository.save).toHaveBeenCalledWith(mockOrganization);
  });

  it('should delete a organization', async () => {
    expect(await service.remove('org-id')).toEqual({ deleted: true });
    expect(repository.softDelete).toHaveBeenCalledWith('org-id');
  });

  it('should return not deleted if delete fails', async () => {
    jest.spyOn(repository, 'softDelete').mockResolvedValue({ affected: 0 });
    expect(await service.remove('org-id')).toEqual({ deleted: false });
    expect(repository.softDelete).toHaveBeenCalledWith('org-id');
  });
});