import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BackofficeController } from './backoffice.controller';
import { BackofficeService } from './backoffice.service';
import { Organization } from '../organizations/entities/organization.entity';
import { User } from '../users/entities/user.entity';
import { Appointment } from '../appointments/entities/appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, User, Appointment])],
  controllers: [BackofficeController],
  providers: [BackofficeService],
  exports: [BackofficeService],
})
export class BackofficeModule {}
