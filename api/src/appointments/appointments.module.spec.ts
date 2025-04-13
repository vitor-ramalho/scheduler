import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsModule } from './appointments.module';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';

describe('AppointmentsModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppointmentsModule],
    }).compile();
  });

  it('should be defined', async () => {
    expect(module).toBeDefined();
  });

  it('should have AppointmentsController defined', async () => {
    const controller = module.get<AppointmentsController>(AppointmentsController);
    expect(controller).toBeDefined();
  });

  it('should have AppointmentsService defined', async () => {
    const service = module.get<AppointmentsService>(AppointmentsService);
    expect(service).toBeDefined();
  });
});