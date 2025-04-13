import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsController } from '../organizations.controller';
import { OrganizationsService } from '../organizations.service';
import { CreateOrganizationDto } from '../dto/organization.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { Organization } from '../entities/organization.entity';

describe('OrganizationsController', () => {
  let controller: OrganizationsController;
  let service: OrganizationsService;

  const mockOrganization: Organization = {
    id: 'org-id',
    name: 'Test Organization',
    slug: 'test-organization',
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
    users: [],
    clients: [],
    professionals: [],
    appointments: [],
    plan: {
      id: 'plan-id',
      name: 'Test Plan',
      description: 'Test Plan Description',
      price: 100,
      features: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    }
  };


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationsController],
      providers: [
        {
          provide: OrganizationsService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockOrganization),
            findAll: jest.fn().mockResolvedValue([mockOrganization]),
            findOne: jest.fn().mockResolvedValue(mockOrganization),
            update: jest.fn().mockResolvedValue(mockOrganization),
            remove: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    controller = module.get<OrganizationsController>(OrganizationsController);
    service = module.get<OrganizationsService>(OrganizationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an organization', async () => {
    const createOrganizationDto: CreateOrganizationDto = {
      name: 'New Organization',
      slug: 'new-organization',
      planId: 'plan-id'
    };
    expect(await controller.create(createOrganizationDto)).toEqual(mockOrganization);
    expect(service.create).toHaveBeenCalledWith(createOrganizationDto);
  });

  it('should find all organizations', async () => {
    expect(await controller.findAll()).toEqual([mockOrganization]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should find one organization', async () => {
    expect(await controller.findOne('org-id')).toEqual(mockOrganization);
    expect(service.findOne).toHaveBeenCalledWith('org-id');
  });

  it('should update an organization', async () => {
    const updateOrganizationDto: UpdateOrganizationDto = {
      name: 'Updated Organization',
    };
    expect(await controller.update('org-id', updateOrganizationDto)).toEqual(mockOrganization);
    expect(service.update).toHaveBeenCalledWith('org-id', updateOrganizationDto);
  });

  it('should remove an organization', async () => {
    expect(await controller.remove('org-id')).toEqual(true);
    expect(service.remove).toHaveBeenCalledWith('org-id');
  });
});