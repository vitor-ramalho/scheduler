import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Appointment } from '../appointments/entities/appointment.entity'; // Import Appointment entity
import { Organization } from '../organizations/entities/organization.entity';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { OrganizationEnabledGuard } from '../common/guards/organization-enabled.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Appointment, Organization])], // Ensure only necessary entities are imported
  controllers: [ClientsController],
  providers: [ClientsService, OrganizationEnabledGuard],
  exports: [TypeOrmModule],
})
export class ClientsModule {}
