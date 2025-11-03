import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { OrganizationEnabledGuard } from '../common/guards/organization-enabled.guard';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, OrganizationEnabledGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard statistics retrieved successfully',
  })
  async getDashboardStats(@Req() req) {
    const organizationId = req.user.organizationId;
    return await this.dashboardService.getDashboardStats(organizationId);
  }

  @Get('recent-appointments')
  @ApiOperation({ summary: 'Get recent appointments' })
  @ApiResponse({
    status: 200,
    description: 'Recent appointments retrieved successfully',
  })
  async getRecentAppointments(@Req() req) {
    const organizationId = req.user.organizationId;
    return this.dashboardService.getRecentAppointments(organizationId);
  }

  @Get('upcoming-appointments')
  @ApiOperation({ summary: 'Get upcoming appointments for today' })
  @ApiResponse({
    status: 200,
    description: 'Upcoming appointments retrieved successfully',
  })
  async getUpcomingAppointments(@Req() req) {
    const organizationId = req.user.organizationId;
    return this.dashboardService.getUpcomingAppointments(organizationId);
  }

  @Get('monthly-stats')
  @ApiOperation({ summary: 'Get monthly appointment statistics' })
  @ApiResponse({
    status: 200,
    description: 'Monthly statistics retrieved successfully',
  })
  async getMonthlyStats(@Req() req) {
    const organizationId = req.user.organizationId;
    return this.dashboardService.getMonthlyStats(organizationId);
  }
}
