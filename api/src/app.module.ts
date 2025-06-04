import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { configs } from './config';
import { AppointmentsModule } from './appointments/appointments.module';
import { ClientsModule } from './clients/clients.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { PlansModule } from './plans/plans.module';
import { PaymentModule } from './payment/payment.module';
import { AdminModule } from './admin/admin.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configs,
      envFilePath: '.env',
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseConfig =
          configService.get<TypeOrmModuleOptions>('database');
        if (!databaseConfig) {
          throw new Error('Database configuration is missing or invalid');
        }
        return databaseConfig;
      },
    }),
    AuthModule,
    UsersModule,
    AppointmentsModule,
    ClientsModule,
    OrganizationsModule,
    PlansModule,
    PaymentModule,
    AdminModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
