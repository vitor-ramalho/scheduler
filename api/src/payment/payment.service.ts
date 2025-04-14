import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentProvider } from './interfaces/payment.provider.interface';
import { GeneratePixDto } from './providers/dto/generate-pix.dto';
import { CreatePaymentDTO } from './dto/create-payment.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class PaymentService {
  constructor(
    @Inject('PaymentProvider')
    private readonly paymentProvider: PaymentProvider,
    private readonly configService: ConfigService,
    private readonly userService: UsersService
  ) { }

  async createPayment(amount: number, orderId: string) {
    const apiUrl = this.configService.get<string>('API_URL');
    const clientUrl = this.configService.get<string>('CLIENT_URL');

    return this.paymentProvider.createPayment({
      amount,
      orderId,
      callbackUrl: `${apiUrl}/payment/webhook`,
      returnUrl: `${clientUrl}/payment/success`,
      cancelUrl: `${clientUrl}/payment/cancel`,
    });
  }

  async getPaymentStatus(paymentId: string) {
    return this.paymentProvider.getPaymentStatus(paymentId);
  }

  async generateQrCodePayment(data: CreatePaymentDTO) {
    const user = await this.userService.findOne(data.userId, data.organizationId);

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.organization?.phone || !user.organization?.email || !user.organization?.identifier) {
      throw new Error('Organization phone, email and identifier are required');
    }

    const generateQrCodePixData: GeneratePixDto = { 
      amount: data.amount,
      expiredIn: data.expiredIn,
      description: data.description,
      customer: {
        cellphone: user.organization.phone,
        email: user.organization.email,
        name: user.firstName + ' ' + user.lastName,
        taxId: user.organization.identifier
      }
    };

    return this.paymentProvider.generatePixQrCode(generateQrCodePixData);
  }
}