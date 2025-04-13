import { Test, TestingModule } from '@nestjs/testing';
import { ProfessionalModule } from './professional.module';
import { ProfessionalController } from './professional.controller';
import { ProfessionalService } from './professional.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Professional } from './entities/professional.entity';
import { User } from '../users/entities/user.entity'; // Assuming User entity is in a separate module
import { Organization } from '../organizations/entities/organization.entity'; // Assuming Organization entity is in a separate module

describe('ProfessionalModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ProfessionalModule,
        TypeOrmModule.forRoot({
          type: 'sqlite', // Use SQLite for testing, or your preferred in-memory database
          database: ':memory:',
          entities: [Professional, User, Organization], // Include all entities used in the module
          synchronize: true, // Only use synchronize in testing environments
        }),
      ],
    }).compile();
  });

  it('should compile the module', () => {
    expect(module).toBeDefined();
  });

  it('should have the ProfessionalController defined', () => {
    const controller = module.get<ProfessionalController>(ProfessionalController);
    expect(controller).toBeDefined();
  });

  it('should have the ProfessionalService defined', () => {
    const service = module.get<ProfessionalService>(ProfessionalService);
    expect(service).toBeDefined();
  });

  // You can add more specific tests here, e.g., checking if the module
  // correctly injects dependencies into the controller and service.
});