import { Test, TestingModule } from '@nestjs/testing';
import { ProfessionalService } from './professional.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Professional } from './entities/professional.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('ProfessionalService', () => {
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

  // Add tests for create, findAll, update, and remove methods
});
