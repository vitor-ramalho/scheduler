import { Controller, Post, Body, Get } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './entities/appointment.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { GetUser } from '../common/decorators/get-user.decorator';
import { AppointmentDto } from './dto/appointment.dto';

@ApiTags('appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiResponse({
    status: 201,
    description: 'Appointment created successfully',
    type: AppointmentDto,
  })
  @ApiBody({ type: AppointmentDto })
  @Post()
  createAppointment(
    @Body() appointmentData: Partial<AppointmentDto>,
    @GetUser('organizationId') organizationId: string,
  ) {
    return this.appointmentsService.createAppointment(
      appointmentData,
      organizationId,
    );
  }

  @ApiOperation({ summary: 'Get all appointments' })
  @ApiResponse({
    status: 200,
    description: 'List of appointments',
    type: [AppointmentDto],
  })
  @Get()
  findAppointments(@GetUser('organizationId') organizationId: string) {
    return this.appointmentsService.findAppointments(organizationId);
  }
}
