import { Test, TestingModule } from '@nestjs/testing';
import { PlansModule } from '../src/plans/plans.module';
import { PlansController } from '../src/plans/plans.controller';
import { PlansService } from '../src/plans/plans.service';

describe('PlansModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [PlansModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have PlansController', () => {
    const controller = module.get<PlansController>(PlansController);
    expect(controller).toBeDefined();
  });

  it('should have PlansService', () => {
    const service = module.get<PlansService>(PlansService);
    expect(service).toBeDefined();
  });
});