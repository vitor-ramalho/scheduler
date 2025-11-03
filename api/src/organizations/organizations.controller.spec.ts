import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';
import { OrganizationDto } from './dto/organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

describe('OrganizationsController', () => {
  let controller: OrganizationsController;
  let service: OrganizationsService;

  const mockOrganization = {
    id: '1',
    name: 'Test Organization',
    email: 'test@example.com',
    plan: { id: 'plan-1' },
  };

  const mockJwtGuard = { canActivate: jest.fn().mockReturnValue(true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationsController],
      providers: [
        {
          provide: OrganizationsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtGuard)
      .compile();

    controller = module.get<OrganizationsController>(OrganizationsController);
    service = module.get<OrganizationsService>(OrganizationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an organization', async () => {
      const organizationDto: OrganizationDto = {
        name: 'Test Organization',
        email: 'test@example.com',
        planId: 'plan-1',
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockOrganization as any);

      const result = await controller.create(organizationDto);

      expect(service.create).toHaveBeenCalledWith(organizationDto);
      expect(result).toEqual(mockOrganization);
    });
  });

  describe('findAll', () => {
    it('should return all organizations', async () => {
      jest
        .spyOn(service, 'findAll')
        .mockResolvedValue([mockOrganization] as any);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockOrganization]);
    });
  });

  describe('findById', () => {
    it('should return an organization by id', async () => {
      jest
        .spyOn(service, 'findById')
        .mockResolvedValue(mockOrganization as any);

      const result = await controller.findById('1');

      expect(service.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockOrganization);
    });
  });

  describe('update', () => {
    it('should update an organization', async () => {
      const updateData: UpdateOrganizationDto = {
        name: 'Updated Organization',
      };
      const updatedOrganization = { ...mockOrganization, ...updateData };

      jest
        .spyOn(service, 'update')
        .mockResolvedValue(updatedOrganization as any);

      const result = await controller.update('1', updateData);

      expect(service.update).toHaveBeenCalledWith('1', updateData);
      expect(result).toEqual(updatedOrganization);
    });
  });
});
