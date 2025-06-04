import { Controller, Post, Body, Get, Param, UseGuards, BadRequestException } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto/subscription.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

interface UserRequest {
  id: string;
  email: string;
  organizationId: string;
  role: string;
}

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createSubscription(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
    @GetUser() user: UserRequest,
  ) {
    // Ensure the user can only create subscriptions for their own organization
    if (user.organizationId !== createSubscriptionDto.organizationId) {
      throw new BadRequestException(
        'You can only create subscriptions for your own organization',
      );
    }
    
    return this.subscriptionService.createSubscription(createSubscriptionDto);
  }

  @Post('webhook')
  async updateSubscriptionStatus(
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionService.updateSubscriptionStatus(updateSubscriptionDto);
  }

  @Get(':organizationId')
  @UseGuards(JwtAuthGuard)
  async getSubscriptionStatus(
    @Param('organizationId') organizationId: string,
    @GetUser() user: UserRequest,
  ) {
    // Ensure the user can only view their own organization's subscription
    if (user.organizationId !== organizationId) {
      throw new BadRequestException(
        'You can only view subscriptions for your own organization',
      );
    }
    
    return this.subscriptionService.getSubscriptionStatus(organizationId);
  }
}
