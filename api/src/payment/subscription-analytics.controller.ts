import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { SubscriptionAnalyticsService } from './subscription-analytics.service';

@Controller('subscription-analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('superadmin')
export class SubscriptionAnalyticsController {
  constructor(
    private readonly subscriptionAnalyticsService: SubscriptionAnalyticsService,
  ) {}

  @Get('summary')
  async getSubscriptionSummary() {
    return this.subscriptionAnalyticsService.getSubscriptionSummary();
  }

  @Get('expiring/:days')
  async getExpiringSubscriptions(@Param('days') days: number) {
    return this.subscriptionAnalyticsService.getExpiringSubscriptions(days);
  }

  @Get('history/:organizationId')
  async getOrganizationSubscriptionHistory(@Param('organizationId') organizationId: string) {
    return this.subscriptionAnalyticsService.getOrganizationSubscriptionHistory(organizationId);
  }
}
