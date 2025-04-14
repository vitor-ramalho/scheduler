import { Test, TestingModule } from '@nestjs/testing';
import { AbacatePayProvider } from '../../../src/payment/providers/abacate-pay.provider';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AbacatePayProvider', () => {
  let provider: AbacatePayProvider;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'ABACATE_PAY_SECRET_KEY') {
        return 'test-secret-key';
      }
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AbacatePayProvider,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    provider = module.get<AbacatePayProvider>(AbacatePayProvider);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('should throw error when secret key is not defined', async () => {
    mockConfigService.get.mockReturnValueOnce(null);

    expect(() => new AbacatePayProvider(configService)).toThrow('ABACATE_PAY_SECRET_KEY is not defined');
  });

  describe('createPayment', () => {
    it('should create a payment successfully', async () => {
      const paymentData = {
        amount: 100,
        orderId: 'order-123',
        callbackUrl: 'http://callback.example.com',
        returnUrl: 'http://return.example.com',
        cancelUrl: 'http://cancel.example.com',
      };

      const mockResponse = {
        data: {
          id: 'payment-123',
          redirect_url: 'https://payment.example.com/checkout',
          status: 'pending',
          amount: 10000, // Amount in cents
          currency: 'BRL',
          created_at: '2024-04-13T00:00:00Z',
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await provider.createPayment(paymentData);

      expect(result).toEqual({
        id: 'payment-123',
        redirect_url: 'https://payment.example.com/checkout',
        status: 'pending',
        amount: 100, // Converted back from cents
        currency: 'BRL',
        created_at: '2024-04-13T00:00:00Z',
      });

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.abacatepay.com/v1/payments',
        {
          amount: 10000,
          currency: 'BRL',
          payment_method: 'pix',
          order_id: 'order-123',
          callback_url: 'http://callback.example.com',
          return_url: 'http://return.example.com',
          cancel_url: 'http://cancel.example.com',
        },
        {
          headers: {
            'Authorization': 'Bearer test-secret-key',
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should handle API errors', async () => {
      const paymentData = {
        amount: 100,
        orderId: 'order-123',
        callbackUrl: 'http://callback.example.com',
        returnUrl: 'http://return.example.com',
        cancelUrl: 'http://cancel.example.com',
      };

      mockedAxios.post.mockRejectedValue(new Error('API Error'));

      await expect(provider.createPayment(paymentData)).rejects.toThrow('AbacatePay payment creation failed: API Error');
    });
  });

  describe('getPaymentStatus', () => {
    it('should get payment status successfully', async () => {
      const paymentId = 'payment-123';
      const mockResponse = {
        data: {
          id: paymentId,
          status: 'completed',
          amount: 10000,
          currency: 'BRL',
          created_at: '2024-04-13T00:00:00Z',
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await provider.getPaymentStatus(paymentId);

      expect(result).toEqual({
        id: paymentId,
        status: 'completed',
        amount: 100,
        currency: 'BRL',
        created_at: '2024-04-13T00:00:00Z',
      });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.abacatepay.com/v1/payments/payment-123',
        {
          headers: {
            'Authorization': 'Bearer test-secret-key',
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should handle API errors', async () => {
      const paymentId = 'payment-123';
      mockedAxios.get.mockRejectedValue(new Error('API Error'));

      await expect(provider.getPaymentStatus(paymentId)).rejects.toThrow('AbacatePay status check failed: API Error');
    });
  });

  describe('generatePixQrCode', () => {
    it('should generate PIX QR code successfully', async () => {
      const pixData = {
        amount: 100,
        expiredIn: 3600,
        description: 'Test payment',
        customer: {
          name: 'John Doe',
          cellphone: '+5511999999999',
          email: 'john@example.com',
          taxId: '12345678900',
        },
      };

      const mockResponse = {
        data: {
          id: 'pix-123',
          amount: 100,
          status: 'pending',
          brCode: '00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540510.005802BR5913Test%20Merchant6008BRASILIA62070503***6304E2CA',
          brCodeBase64: 'base64string',
          platformFee: 0,
          createdAt: '2024-04-13T00:00:00Z',
          updatedAt: '2024-04-13T00:00:00Z',
          expiresAt: '2024-04-13T01:00:00Z',
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await provider.generatePixQrCode(pixData);

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.abacatepay.com/v1/pixQrCode/create',
        pixData,
        {
          headers: {
            'Authorization': 'Bearer test-secret-key',
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should handle API errors', async () => {
      const pixData = {
        amount: 100,
        expiredIn: 3600,
        description: 'Test payment',
        customer: {
          name: 'John Doe',
          cellphone: '+5511999999999',
          email: 'john@example.com',
          taxId: '12345678900',
        },
      };

      mockedAxios.post.mockRejectedValue(new Error('API Error'));

      await expect(provider.generatePixQrCode(pixData)).rejects.toThrow('AbacatePay PIX QR code generation failed: API Error');
    });
  });
}); 