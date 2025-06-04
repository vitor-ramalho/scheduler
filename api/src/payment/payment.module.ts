import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionRenewalService } from './subscription-renewal.service';
import { SubscriptionAnalyticsService } from './subscription-analytics.service';
import { SubscriptionAnalyticsController } from './subscription-analytics.controller';
import { SubscriptionNotificationService } from './subscription-notification.service';
import { AbacatePayProvider } from './providers/abacate-pay.provider';
import { UsersModule } from 'src/users/users.module';
import { Organization } from '../organizations/entities/organization.entity';
import { Plan } from '../plans/entities/plan.entity';
import { User } from '../users/entities/user.entity';
import { Subscription } from './entities/subscription.entity';

@Module({
  imports: [
    ConfigModule, 
    UsersModule,
    TypeOrmModule.forFeature([Organization, Plan, User, Subscription]),
    ScheduleModule.forRoot()
  ],
  controllers: [
    PaymentController, 
    SubscriptionController,
    SubscriptionAnalyticsController
  ],
  providers: [
    PaymentService,
    SubscriptionService,
    SubscriptionRenewalService,
    SubscriptionAnalyticsService,
    SubscriptionNotificationService,
    {
      provide: 'PaymentProvider',
      useClass: AbacatePayProvider,
    },
  ],
  exports: [
    PaymentService, 
    SubscriptionService, 
    SubscriptionAnalyticsService, 
    SubscriptionNotificationService
  ],
})
export class PaymentModule {}