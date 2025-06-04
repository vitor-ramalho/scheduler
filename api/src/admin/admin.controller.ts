import { Controller, Get, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { OrganizationsService } from '../organizations/organizations.service';
import { SubscriptionService } from '../payment/subscription.service';
import { UpdateOrganizationDto } from '../organizations/dto/update-organization.dto';

@Controller('admin/organizations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('superadmin')
export class AdminController {
  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @Get()
  async getAllOrganizations() {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  async getOrganization(@Param('id') id: string) {
    return this.organizationsService.findById(id);
  }

  @Patch(':id')
  async updateOrganization(
    @Param('id') id: string,
    @Body() updateData: UpdateOrganizationDto,
  ) {
    return this.organizationsService.update(id, updateData);
  }

  @Delete(':id')
  async deleteOrganization(@Param('id') id: string) {
    return this.organizationsService.remove(id);
  }

  @Get(':id/subscription')
  async getSubscriptionStatus(@Param('id') id: string) {
    return this.subscriptionService.getSubscriptionStatus(id);
  }
}
