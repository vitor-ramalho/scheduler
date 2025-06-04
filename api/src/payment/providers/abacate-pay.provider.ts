import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  CreatePaymentDTO,
  PaymentProvider,
  PaymentResponse,
  PIXPaymentResponse,
} from '../interfaces/payment.provider.interface';
import { GeneratePixDto } from './dto/generate-pix.dto';

@Injectable()
export class AbacatePayProvider implements PaymentProvider {
  private readonly apiKey: string;
  private readonly apiUrl: string = 'https://api.abacatepay.com/v1';

  constructor(private readonly configService: ConfigService) {
    const key = this.configService.get<string>('app.payment.abacatePay.secretKey');
    if (!key) {
      throw new Error('AbacatePay secret key is not defined. Please check your environment configuration.');
    }
    this.apiKey = key;
  }

  private get headers() {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  async generatePixQrCode(data: GeneratePixDto): Promise<PIXPaymentResponse> {
    try {
      const response = await axios.post<PIXPaymentResponse>(
        `${this.apiUrl}/pixQrCode/create`,
        data,
        { headers: this.headers },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `AbacatePay PIX QR code generation failed: ${error.message}`,
      );
    }
  }

  async createPayment(data: CreatePaymentDTO): Promise<PaymentResponse> {
    try {
      const response = await axios.post<{
        id: string;
        redirect_url: string;
        status: string;
        amount: number;
        currency: string;
        created_at: string;
      }>(
        `${this.apiUrl}/payments`,
        {
          amount: Math.round(data.amount * 100), // Convert to cents
          currency: data.currency || 'BRL',
          payment_method: 'pix',
          order_id: data.orderId,
          callback_url: data.callbackUrl,
          return_url: data.returnUrl,
          cancel_url: data.cancelUrl,
        },
        { headers: this.headers },
      );

      return this.mapPaymentResponse(response.data);
    } catch (error: any) {
      throw new Error(`AbacatePay payment creation failed: ${error.message}`);
    }
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    try {
      const response = await axios.get<{
        id: string;
        redirect_url: string;
        status: string;
        amount: number;
        currency: string;
        created_at: string;
      }>(`${this.apiUrl}/payments/${paymentId}`, {
        headers: this.headers,
      });

      return this.mapPaymentResponse(response.data);
    } catch (error: any) {
      throw new Error(`AbacatePay status check failed: ${error.message}`);
    }
  }

  private mapPaymentResponse(data: {
    id: string;
    redirect_url: string;
    status: string;
    amount: number;
    currency: string;
    created_at: string;
  }): PaymentResponse {
    return {
      id: data.id,
      redirect_url: data.redirect_url,
      status: data.status,
      amount: data.amount / 100, // Convert from cents
      currency: data.currency,
      created_at: data.created_at,
    };
  }
}
