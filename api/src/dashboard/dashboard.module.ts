import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Client } from '../clients/entities/client.entity';
import { Professional } from '../professional/entities/professional.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { OrganizationEnabledGuard } from '../common/guards/organization-enabled.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, Client, Professional, Organization]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService, OrganizationEnabledGuard],
  exports: [DashboardService],
})
export class DashboardModule {}
