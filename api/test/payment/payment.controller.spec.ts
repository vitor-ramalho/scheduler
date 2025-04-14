import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from '../../src/payment/payment.controller';
import { PaymentService } from '../../src/payment/payment.service';
import { CreatePaymentDTO } from '../../src/payment/dto/create-payment.dto';

describe('PaymentController', () => {
  let controller: PaymentController;
  let service: PaymentService;

  const mockPaymentService = {
    generateQrCodePayment: jest.fn(),
    getPaymentStatus: jest.fn(),
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

  describe('createPayment', () => {
    it('should create a payment and return the QR code', async () => {
      const createPaymentDto: CreatePaymentDTO = {
        amount: 100,
        expiredIn: 3600,
        description: 'Test payment',
        userId: 'user-123',
        organizationId: 'org-123',
      };

      const expectedResponse = {
        id: 'payment-123',
        amount: 100,
        status: 'pending',
        brCode: '00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540510.005802BR5913Test%20Merchant6008BRASILIA62070503***6304E2CA',
        brCodeBase64: 'base64string',
        platformFee: 0,
        createdAt: '2024-04-13T00:00:00Z',
        updatedAt: '2024-04-13T00:00:00Z',
        expiresAt: '2024-04-13T01:00:00Z',
      };

      mockPaymentService.generateQrCodePayment.mockResolvedValue(expectedResponse);

      const result = await controller.createPayment(createPaymentDto);

      expect(result).toEqual(expectedResponse);
      expect(mockPaymentService.generateQrCodePayment).toHaveBeenCalledWith(createPaymentDto);
    });
  });

  describe('getPaymentStatus', () => {
    it('should return payment status', async () => {
      const paymentId = 'payment-123';
      const expectedResponse = {
        id: paymentId,
        status: 'completed',
        amount: 100,
        currency: 'BRL',
        created_at: '2024-04-13T00:00:00Z',
      };

      mockPaymentService.getPaymentStatus.mockResolvedValue(expectedResponse);

      const result = await controller.getPaymentStatus(paymentId);

      expect(result).toEqual(expectedResponse);
      expect(mockPaymentService.getPaymentStatus).toHaveBeenCalledWith(paymentId);
    });
  });
}); 