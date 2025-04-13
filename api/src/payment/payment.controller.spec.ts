import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from '../src/payment/payment.controller';
import { PaymentService } from '../src/payment/payment.service';
import { CreatePaymentDto } from '../src/payment/dto/create-payment.dto';
import { Request } from 'express';

describe('PaymentController', () => {
  let controller: PaymentController;
  let service: PaymentService;

  const mockPaymentService = {
    create: jest.fn((dto: CreatePaymentDto, req: Request) => ({
      /* mock implementation or return value */
    })),
    // Add other methods as needed
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        {
          provide: PaymentService,
          useValue: mockPaymentService,
        },
      ],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
    service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call paymentService.create with correct parameters', async () => {
      const createPaymentDto: CreatePaymentDto = {
        /* sample DTO data */
      };
      const mockRequest = {
        /* mock request object if needed */
      } as Request;

      await controller.create(createPaymentDto, mockRequest);
      expect(service.create).toHaveBeenCalledWith(createPaymentDto, mockRequest);
    });

    // Add more test cases for different scenarios, e.g., successful creation, validation errors, etc.
  });

  // Add tests for other controller methods (e.g., findAll, findOne, update, remove) if they exist
});