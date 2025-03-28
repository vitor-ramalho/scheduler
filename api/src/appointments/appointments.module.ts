import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { ClientsModule } from '../clients/clients.module';
import { ProfessionalModule } from 'src/professional/professional.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment]),
    ProfessionalModule,
    ClientsModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
