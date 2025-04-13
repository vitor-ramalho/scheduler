import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsModule } from '../src/organizations/organizations.module';
import { OrganizationsController } from '../src/organizations/organizations.controller';
import { OrganizationsService } from '../src/organizations/organizations.service';

describe('OrganizationsModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [OrganizationsModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have OrganizationsController', () => {
    const controller = module.get<OrganizationsController>(OrganizationsController);
    expect(controller).toBeDefined();
  });

  it('should have OrganizationsService', () => {
    const service = module.get<OrganizationsService>(OrganizationsService);
    expect(service).toBeDefined();
  });
});