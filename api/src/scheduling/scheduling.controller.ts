import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import { Schedule } from './entities/schedule.entity';
import { Appointment } from './entities/appointment.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { GetUser } from '../common/decorators/get-user.decorator';
import { ScheduleDto } from './dto/schedule.dto';
import { AppointmentDto } from './dto/appointment.dto';

@ApiTags('scheduling')
@Controller('scheduling')
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  @ApiOperation({ summary: 'Create a new schedule' })
  @ApiResponse({
    status: 201,
    description: 'Schedule created successfully',
    type: ScheduleDto,
  })
  @ApiBody({ type: ScheduleDto })
  @Post('schedules')
  createSchedule(
    @Body() scheduleData: Partial<ScheduleDto>,
    @GetUser('organizationId') organizationId: string,
  ) {
    return this.schedulingService.createSchedule(scheduleData, organizationId);
  }

  @ApiOperation({ summary: 'Get schedules for a user' })
  @ApiResponse({
    status: 200,
    description: 'List of schedules',
    type: [ScheduleDto],
  })
  @Get('schedules')
  findSchedules(@GetUser('organizationId') organizationId: string) {
    return this.schedulingService.findSchedules(organizationId);
  }

  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiResponse({
    status: 201,
    description: 'Appointment created successfully',
    type: AppointmentDto,
  })
  @ApiBody({ type: AppointmentDto })
  @Post('appointments')
  createAppointment(
    @Body() appointmentData: Partial<AppointmentDto>,
    @GetUser('organizationId') organizationId: string,
  ) {
    return this.schedulingService.createAppointment(
      appointmentData,
      organizationId,
    );
  }
}
