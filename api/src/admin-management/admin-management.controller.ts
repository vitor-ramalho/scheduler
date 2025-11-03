import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { AdminManagementService } from './admin-management.service';

@ApiTags('Admin Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin-management')
export class AdminManagementController {
  constructor(
    private readonly adminManagementService: AdminManagementService,
  ) {}

  @Get('admins')
  @ApiOperation({ summary: 'List all admin users' })
  @ApiResponse({
    status: 200,
    description: 'Admin users retrieved successfully',
  })
  async getAdmins() {
    return await this.adminManagementService.getAdmins();
  }

  @Post('create-admin')
  @ApiOperation({ summary: 'Create new admin user (admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Admin user created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async createAdmin(
    @Body()
    createAdminDto: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    },
  ) {
    return await this.adminManagementService.createAdmin(createAdminDto);
  }

  @Delete('admin/:id')
  @ApiOperation({ summary: 'Remove admin user (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Admin user removed successfully',
  })
  async removeAdmin(@Param('id') id: string) {
    return await this.adminManagementService.removeAdmin(id);
  }
}
