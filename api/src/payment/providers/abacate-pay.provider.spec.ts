import { AbacatePayProvider } from './abacate-pay.provider';
import { GeneratePixDto } from '../dto/generate-pix.dto';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('AbacatePayProvider', () => {
  let provider: AbacatePayProvider;
  let configService: ConfigService;
  let httpService: HttpService;

  beforeEach(() => {
    configService = {
      get: jest.fn((key: string) => {
        switch (key) {
          case 'ABACATE_PAY_API_KEY':
            return 'test_api_key';
          case 'ABACATE_PAY_SECRET_KEY':
            return 'test_secret_key';
          case 'ABACATE_PAY_BASE_URL':
            return 'https://test.abacatepay.com';
          default:
            return null;
        }
      }),
    } as any;

    httpService = {
      post: jest.fn(),
    } as any;

    provider = new AbacatePayProvider(configService, httpService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('generatePix', () => {
    it('should generate a Pix payment successfully', async () => {
      const generatePixDto: GeneratePixDto = {
        value: 100,
        key: 'test@example.com',
        keyType: 'email',
        payer: {
          name: 'Test Payer',
          document: '12345678900',
          documentType: 'cpf',
        },
      };

      const mockResponse: AxiosResponse = {
        data: {
          qrcode: 'mock_qrcode',
          txid: 'mock_txid',
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      (httpService.post as jest.Mock).mockReturnValue(of(mockResponse));

      const result = await provider.generatePix(generatePixDto);

      expect(httpService.post).toHaveBeenCalledWith(
        'https://test.abacatepay.com/v1/pix/qrcodes',
        {
          value: 100,
          key: 'test@example.com',
          key_type: 'email',
          payer: {
            name: 'Test Payer',
            document: '12345678900',
            document_type: 'cpf',
          },
        },
        {
          headers: {
            'X-API-KEY': 'test_api_key',
            'X-SECRET-KEY': 'test_secret_key',
          },
        },
      );
      expect(result).toEqual({
        qrcode: 'mock_qrcode',
        txid: 'mock_txid',
      });
    });

    it('should handle errors when generating Pix payment', async () => {
      const generatePixDto: GeneratePixDto = {
        value: 100,
        key: 'test@example.com',
        keyType: 'email',
        payer: {
          name: 'Test Payer',
          document: '12345678900',
          documentType: 'cpf',
        },
      };

      (httpService.post as jest.Mock).mockReturnValue(
        of({
          data: {},
          status: 500,
          statusText: 'Internal Server Error',
          headers: {},
          config: {},
        }),
      );

      await expect(provider.generatePix(generatePixDto)).rejects.toThrowError(
        'Failed to generate Pix payment with Abacate Pay',
      );
    });
  });
});