import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GetUser } from '../common/decorators/get-user.decorator';
import { AppointmentDto } from './dto/appointment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('appointments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiCreatedResponse({
    description: 'Appointment created successfully',
    type: AppointmentDto,
  })
  @ApiBody({ type: AppointmentDto })
  @Post('/:professionalId')
  @HttpCode(HttpStatus.CREATED)
  createAppointment(
    @Body() appointmentData: AppointmentDto,
    @Param('professionalId') professionalId: string,
    @GetUser('organizationId') organizationId: string,
  ) {
    console.log({ appointmentData });
    return this.appointmentsService.createAppointment(
      appointmentData,
      organizationId,
      professionalId,
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

  @ApiOperation({ summary: 'Get all appointments' })
  @ApiResponse({
    status: 200,
    description: 'List of appointments',
    type: [AppointmentDto],
  })
  @Get('/:professionalId')
  findAppointmentsByProfessional(
    @GetUser('organizationId') organizationId: string,
    @Param('professionalId') professionalId: string,
  ) {
    return this.appointmentsService.findAppointmentsByProfessional(
      organizationId,
      professionalId,
    );
  }
}
