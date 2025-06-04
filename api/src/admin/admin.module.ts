import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { OrganizationsModule } from '../organizations/organizations.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [OrganizationsModule, PaymentModule],
  controllers: [AdminController],
})
export class AdminModule {}
