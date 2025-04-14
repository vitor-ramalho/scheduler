import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';
import { Organization } from '../organizations/entities/organization.entity';
import { Plan } from '../plans/entities/plan.entity';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockPlan: Plan = {
    id: 'plan-1',
    name: 'Basic Plan',
    description: 'Basic plan description',
    price: 0,
    features: [],
    organizations: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockOrganization: Organization = {
    id: 'org-1',
    name: 'Test Organization',
    slug: 'test-org',
    identifier: '123456',
    phone: '+1234567890',
    email: 'test@org.com',
    plan: mockPlan,
    isActive: true,
    users: [],
    clients: [],
    professionals: [],
    appointments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    password: 'hashed',
    role: 'user',
    isActive: true,
    organizationId: 'org-1',
    organization: mockOrganization,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users for a given organization', async () => {
      const users = [mockUser];
      jest.spyOn(repository, 'find').mockResolvedValue(users);

      const result = await service.findAll('org-1');
      expect(result).toEqual(users);
      expect(repository.find).toHaveBeenCalledWith({
        where: { organizationId: 'org-1' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser);

      const result = await service.findOne('1', 'org-1');
      expect(result).toEqual(mockUser);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '1', organizationId: 'org-1' },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('1', 'org-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'User',
        password: 'password',
        role: 'user',
      };

      jest.spyOn(repository, 'create').mockReturnValue(mockUser);
      jest.spyOn(repository, 'save').mockResolvedValue(mockUser);

      const result = await service.create(createUserDto, 'org-1');
      expect(result).toEqual(mockUser);
      expect(repository.create).toHaveBeenCalledWith({
        ...createUserDto,
        organizationId: 'org-1',
      });
      expect(repository.save).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('update', () => {
    it('should update and return the user', async () => {
      const updateUserDto: UpdateUserDto = {
        firstName: 'Updated',
      };

      const updatedUser = { ...mockUser, ...updateUserDto };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedUser);

      const result = await service.update('1', updateUserDto, 'org-1');
      expect(result).toEqual(updatedUser);
      expect(repository.save).toHaveBeenCalledWith(updatedUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(service.update('1', {}, 'org-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove the user', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(repository, 'remove').mockResolvedValue(mockUser);

      await service.remove('1', 'org-1');
      expect(repository.remove).toHaveBeenCalledWith(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(service.remove('1', 'org-1')).rejects.toThrow(NotFoundException);
    });
  });
}); 