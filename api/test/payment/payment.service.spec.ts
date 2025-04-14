import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from '../../src/payment/payment.service';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../src/users/users.service';
import { CreatePaymentDTO } from '../../src/payment/dto/create-payment.dto';
import { GeneratePixDto } from '../../src/payment/providers/dto/generate-pix.dto';

describe('PaymentService', () => {
  let service: PaymentService;
  let configService: ConfigService;
  let userService: UsersService;
  let paymentProvider: any;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      switch (key) {
        case 'API_URL':
          return 'http://api.example.com';
        case 'CLIENT_URL':
          return 'http://client.example.com';
        default:
          return null;
      }
    }),
  };

  const mockUserService = {
    findOne: jest.fn(),
  };

  const mockPaymentProvider = {
    createPayment: jest.fn(),
    getPaymentStatus: jest.fn(),
    generatePixQrCode: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: UsersService,
          useValue: mockUserService,
        },
        {
          provide: 'PaymentProvider',
          useValue: mockPaymentProvider,
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    configService = module.get<ConfigService>(ConfigService);
    userService = module.get<UsersService>(UsersService);
    paymentProvider = module.get('PaymentProvider');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPayment', () => {
    it('should create a payment with correct parameters', async () => {
      const amount = 100;
      const orderId = 'order-123';
      const expectedResponse = {
        id: 'payment-123',
        redirect_url: 'https://payment.example.com/checkout',
        status: 'pending',
        amount: 100,
        currency: 'BRL',
        created_at: '2024-04-13T00:00:00Z',
      };

      mockPaymentProvider.createPayment.mockResolvedValue(expectedResponse);

      const result = await service.createPayment(amount, orderId);

      expect(result).toEqual(expectedResponse);
      expect(mockPaymentProvider.createPayment).toHaveBeenCalledWith({
        amount,
        orderId,
        callbackUrl: 'http://api.example.com/payment/webhook',
        returnUrl: 'http://client.example.com/payment/success',
        cancelUrl: 'http://client.example.com/payment/cancel',
      });
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

      mockPaymentProvider.getPaymentStatus.mockResolvedValue(expectedResponse);

      const result = await service.getPaymentStatus(paymentId);

      expect(result).toEqual(expectedResponse);
      expect(mockPaymentProvider.getPaymentStatus).toHaveBeenCalledWith(paymentId);
    });
  });

  describe('generateQrCodePayment', () => {
    it('should generate QR code payment successfully', async () => {
      const createPaymentDto: CreatePaymentDTO = {
        amount: 100,
        expiredIn: 3600,
        description: 'Test payment',
        userId: 'user-123',
        organizationId: 'org-123',
      };

      const mockUser = {
        id: 'user-123',
        firstName: 'John',
        lastName: 'Doe',
        organization: {
          phone: '+5511999999999',
          email: 'org@example.com',
          identifier: '12345678900',
        },
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

      mockUserService.findOne.mockResolvedValue(mockUser);
      mockPaymentProvider.generatePixQrCode.mockResolvedValue(expectedResponse);

      const result = await service.generateQrCodePayment(createPaymentDto);

      expect(result).toEqual(expectedResponse);
      expect(mockUserService.findOne).toHaveBeenCalledWith(createPaymentDto.userId, createPaymentDto.organizationId);
      expect(mockPaymentProvider.generatePixQrCode).toHaveBeenCalledWith({
        amount: createPaymentDto.amount,
        expiredIn: createPaymentDto.expiredIn,
        description: createPaymentDto.description,
        customer: {
          name: 'John Doe',
          cellphone: '+5511999999999',
          email: 'org@example.com',
          taxId: '12345678900',
        },
      });
    });

    it('should throw error when user is not found', async () => {
      const createPaymentDto: CreatePaymentDTO = {
        amount: 100,
        expiredIn: 3600,
        description: 'Test payment',
        userId: 'user-123',
        organizationId: 'org-123',
      };

      mockUserService.findOne.mockResolvedValue(null);

      await expect(service.generateQrCodePayment(createPaymentDto)).rejects.toThrow('User not found');
    });

    it('should throw error when organization details are missing', async () => {
      const createPaymentDto: CreatePaymentDTO = {
        amount: 100,
        expiredIn: 3600,
        description: 'Test payment',
        userId: 'user-123',
        organizationId: 'org-123',
      };

      const mockUser = {
        id: 'user-123',
        firstName: 'John',
        lastName: 'Doe',
        organization: {
          phone: null,
          email: null,
          identifier: null,
        },
      };

      mockUserService.findOne.mockResolvedValue(mockUser);

      await expect(service.generateQrCodePayment(createPaymentDto)).rejects.toThrow(
        'Organization phone, email and identifier are required'
      );
    });
  });
}); 