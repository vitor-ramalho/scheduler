import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { BackofficeService } from './backoffice.service';

@ApiTags('Backoffice')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('backoffice')
export class BackofficeController {
  constructor(private readonly backofficeService: BackofficeService) {}

  @Get('organizations')
  @ApiOperation({ summary: 'List all organizations for backoffice management' })
  @ApiResponse({
    status: 200,
    description: 'Organizations retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          slug: { type: 'string' },
          identifier: { type: 'string' },
          phone: { type: 'string' },
          email: { type: 'string' },
          enabled: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          usersCount: { type: 'number' },
          clientsCount: { type: 'number' },
          appointmentsCount: { type: 'number' },
        },
      },
    },
  })
  async getOrganizations() {
    return this.backofficeService.getAllOrganizations();
  }

  @Get('organizations/:id')
  @ApiOperation({ summary: 'Get organization details by ID' })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  @ApiResponse({
    status: 200,
    description: 'Organization details retrieved successfully',
  })
  async getOrganizationById(@Param('id') id: string) {
    return this.backofficeService.getOrganizationDetails(id);
  }

  @Patch('organizations/:id/enable')
  @ApiOperation({ summary: 'Enable an organization' })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  @ApiResponse({
    status: 200,
    description: 'Organization enabled successfully',
  })
  async enableOrganization(@Param('id') id: string) {
    return this.backofficeService.enableOrganization(id);
  }

  @Patch('organizations/:id/disable')
  @ApiOperation({ summary: 'Disable an organization' })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  @ApiResponse({
    status: 200,
    description: 'Organization disabled successfully',
  })
  async disableOrganization(@Param('id') id: string) {
    return this.backofficeService.disableOrganization(id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get backoffice statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalOrganizations: { type: 'number' },
        enabledOrganizations: { type: 'number' },
        disabledOrganizations: { type: 'number' },
        totalUsers: { type: 'number' },
        totalAppointments: { type: 'number' },
      },
    },
  })
  async getStats() {
    return this.backofficeService.getStats();
  }
}
