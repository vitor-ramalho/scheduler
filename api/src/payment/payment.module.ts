import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { AbacatePayProvider } from './providers/abacate-pay.provider';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [ConfigModule, UsersModule],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    {
      provide: 'PaymentProvider',
      useClass: AbacatePayProvider,
    },
  ],
  exports: [PaymentService],
})
export class PaymentModule {}