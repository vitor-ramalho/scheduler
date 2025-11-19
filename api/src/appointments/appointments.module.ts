import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { ClientsModule } from '../clients/clients.module';
import { ProfessionalModule } from 'src/professional/professional.module';
import { Organization } from '../organizations/entities/organization.entity';
import { OrganizationEnabledGuard } from '../common/guards/organization-enabled.guard';
import { EmailModule } from '../notification/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, Organization]),
    ProfessionalModule,
    ClientsModule,
    EmailModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, OrganizationEnabledGuard],
})
export class AppointmentsModule {}
