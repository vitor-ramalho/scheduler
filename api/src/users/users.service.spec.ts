import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const mockUsersRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'password',
      role: 'user',
      organizationId: 'org-id',
    };
    const createdUser: User = {
      id: 'user-id',
      ...createUserDto,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      refreshToken: null,
      organization: {
        id: 'org-id',
        name: 'Test Org',
        slug: 'test-org',
        plan: 'free',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        users: [],
        clients: [],
        professionals: [],
        appointments: [],
      },
    };

    repository.create = jest.fn().mockReturnValue(createdUser);
    repository.save = jest.fn().mockResolvedValue(createdUser);

    const result = await service.create(createUserDto);

    expect(repository.create).toHaveBeenCalledWith(createUserDto);
    expect(repository.save).toHaveBeenCalledWith(createdUser);
    expect(result).toEqual(createdUser);
  });

  it('should throw ConflictException if email already exists', async () => {
    const createUserDto: CreateUserDto = {
      email: 'existing@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'password',
      role: 'user',
      organizationId: 'org-id',
    };
    const existingUser: User = {
      id: 'existing-user-id',
      ...createUserDto,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      refreshToken: null,
      organization: {
        id: 'org-id',
        name: 'Test Org',
        slug: 'test-org',
        plan: 'free',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        users: [],
        clients: [],
        professionals: [],
        appointments: [],
      },
    };

    repository.findOne = jest.fn().mockResolvedValue(existingUser);

    await expect(service.create(createUserDto)).rejects.toThrowError(
      ConflictException,
    );
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { email: createUserDto.email },
    });
  });

  it('should find all users for an organization', async () => {
    const organizationId = 'org-id';
    const users: User[] = [
      {
        id: 'user-id-1',
        email: 'user1@example.com',
        firstName: 'User',
        lastName: 'One',
        password: 'password',
        role: 'user',
        isActive: true,
        refreshToken: null,
        organizationId: organizationId,
        createdAt: new Date(),
        updatedAt: new Date(),
        organization: {
          id: organizationId,
          name: 'Test Org',
          slug: 'test-org',
          plan: 'free',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          users: [],
          clients: [],
          professionals: [],
          appointments: [],
        },
      },
      {
        id: 'user-id-2',
        email: 'user2@example.com',
        firstName: 'User',
        lastName: 'Two',
        password: 'password',
        role: 'user',
        isActive: true,
        refreshToken: null,
        organizationId: organizationId,
        createdAt: new Date(),
        updatedAt: new Date(),
        organization: {
          id: organizationId,
          name: 'Test Org',
          slug: 'test-org',
          plan: 'free',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          users: [],
          clients: [],
          professionals: [],
          appointments: [],
        },
      },
    ];

    repository.find = jest.fn().mockResolvedValue(users);

    const result = await service.findAll(organizationId);

    expect(repository.find).toHaveBeenCalledWith({
      where: { organizationId },
    });
    expect(result).toEqual(users);
  });

  it('should find one user by id', async () => {
    const userId = 'user-id';
    const user: User = {
      id: userId,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'password',
      role: 'user',
      isActive: true,
      refreshToken: null,
      organizationId: 'org-id',
      createdAt: new Date(),
      updatedAt: new Date(),
      organization: {
        id: 'org-id',
        name: 'Test Org',
        slug: 'test-org',
        plan: 'free',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        users: [],
        clients: [],
        professionals: [],
        appointments: [],
      },
    };

    repository.findOne = jest.fn().mockResolvedValue(user);

    const result = await service.findOne(userId);

    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
    expect(result).toEqual(user);
  });

  it('should throw NotFoundException if user is not found by id', async () => {
    const userId = 'non-existent-user-id';

    repository.findOne = jest.fn().mockResolvedValue(null);

    await expect(service.findOne(userId)).rejects.toThrowError(
      NotFoundException,
    );
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
  });

  it('should update a user', async () => {
    const userId = 'user-id';
    const updateUserDto: UpdateUserDto = {
      firstName: 'Updated',
      lastName: 'User',
    };
    const existingUser: User = {
      id: userId,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'password',
      role: 'user',
      isActive: true,
      refreshToken: null,
      organizationId: 'org-id',
      createdAt: new Date(),
      updatedAt: new Date(),
      organization: {
        id: 'org-id',
        name: 'Test Org',
        slug: 'test-org',
        plan: 'free',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        users: [],
        clients: [],
        professionals: [],
        appointments: [],
      },
    };
    const updatedUser: User = {
      ...existingUser,
      ...updateUserDto,
      updatedAt: new Date(),
    };

    repository.findOne = jest.fn().mockResolvedValue(existingUser);
    repository.save = jest.fn().mockResolvedValue(updatedUser);

    const result = await service.update(userId, updateUserDto);

    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
    expect(repository.save).toHaveBeenCalledWith({
      ...existingUser,
      ...updateUserDto,
    });
    expect(result).toEqual(updatedUser);
  });

  it('should throw NotFoundException if user to update is not found', async () => {
    const userId = 'non-existent-user-id';
    const updateUserDto: UpdateUserDto = {
      firstName: 'Updated',
      lastName: 'User',
    };

    repository.findOne = jest.fn().mockResolvedValue(null);

    await expect(service.update(userId, updateUserDto)).rejects.toThrowError(
      NotFoundException,
    );
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
  });

  it('should remove a user', async () => {
    const userId = 'user-id';
    const existingUser: User = {
      id: userId,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'password',
      role: 'user',
      isActive: true,
      refreshToken: null,
      organizationId: 'org-id',
      createdAt: new Date(),
      updatedAt: new Date(),
      organization: {
        id: 'org-id',
        name: 'Test Org',
        slug: 'test-org',
        plan: 'free',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        users: [],
        clients: [],
        professionals: [],
        appointments: [],
      },
    };

    repository.findOne = jest.fn().mockResolvedValue(existingUser);
    repository.delete = jest.fn().mockResolvedValue({ affected: 1 });

    const result = await service.remove(userId);

    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
    expect(repository.delete).toHaveBeenCalledWith(userId);
    expect(result).toEqual({ message: 'User removed successfully' });
  });

  it('should throw NotFoundException if user to remove is not found', async () => {
    const userId = 'non-existent-user-id';

    repository.findOne = jest.fn().mockResolvedValue(null);

    await expect(service.remove(userId)).rejects.toThrowError(
      NotFoundException,
    );
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
  });
});