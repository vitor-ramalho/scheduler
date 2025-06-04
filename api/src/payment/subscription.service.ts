import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto/subscription.dto';
import { Organization } from '../organizations/entities/organization.entity';
import { Plan } from '../plans/entities/plan.entity';
import { PaymentService } from './payment.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
    private readonly paymentService: PaymentService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async createSubscription(createSubscriptionDto: CreateSubscriptionDto) {
    const { planId, organizationId, userId } = createSubscriptionDto;

    // Find the organization
    const organization = await this.organizationRepository.findOne({ 
      where: { id: organizationId } 
    });

    if (!organization) {
      throw new BadRequestException('Organization not found');
    }

    // Find the plan
    const plan = await this.planRepository.findOne({ 
      where: { id: planId } 
    });

    if (!plan) {
      throw new BadRequestException('Plan not found');
    }

    // Check if the user belongs to this organization
    const user = await this.usersService.findOne(userId, organizationId);
    if (!user) {
      throw new BadRequestException('User not found or does not belong to this organization');
    }

    // Update organization with new plan
    organization.plan = plan;
    organization.isPlanActive = false; // Will be activated after payment
    await this.organizationRepository.save(organization);

    // Create payment for subscription
    const orderId = `sub_${organizationId}_${Date.now()}`;
    const description = `Subscription to ${plan.name} plan`;

    // Generate payment for the subscription
    const payment = await this.paymentService.generateQrCodePayment({
      amount: Number(plan.price),
      expiredIn: 3600, // 1 hour expiration
      description,
      userId,
      organizationId
    });

    // Update organization with payment ID
    organization.paymentId = payment.id;
    await this.organizationRepository.save(organization);

    return {
      ...payment,
      plan,
      organization: {
        id: organization.id,
        name: organization.name
      }
    };
  }

  async updateSubscriptionStatus(updateSubscriptionDto: UpdateSubscriptionDto) {
    const { paymentId, status } = updateSubscriptionDto;

    // Find organization with this payment ID
    const organization = await this.organizationRepository.findOne({
      where: { paymentId }
    });

    if (!organization) {
      throw new BadRequestException('Organization with this payment ID not found');
    }

    // Update subscription status based on payment status
    if (status === 'completed' || status === 'approved' || status === 'succeeded') {
      organization.isPlanActive = true;
      
      // Set expiration date based on plan interval (default to 1 month)
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);
      organization.planExpiresAt = expiresAt;
      
      await this.organizationRepository.save(organization);
      
      return {
        success: true,
        message: 'Subscription activated successfully',
        organization: {
          id: organization.id,
          name: organization.name,
          planActive: organization.isPlanActive,
          planExpiresAt: organization.planExpiresAt
        }
      };
    } else if (status === 'failed' || status === 'canceled' || status === 'rejected') {
      // Payment failed, keep subscription inactive
      return {
        success: false,
        message: 'Payment failed or was cancelled',
        organization: {
          id: organization.id,
          name: organization.name,
          planActive: organization.isPlanActive
        }
      };
    }

    // For other statuses, just return the current state
    return {
      success: false,
      message: `Payment status: ${status}`,
      organization: {
        id: organization.id,
        name: organization.name,
        planActive: organization.isPlanActive
      }
    };
  }

  async getSubscriptionStatus(organizationId: string) {
    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
      relations: ['plan']
    });

    if (!organization) {
      throw new BadRequestException('Organization not found');
    }

    return {
      organization: {
        id: organization.id,
        name: organization.name,
        isPlanActive: organization.isPlanActive,
        planExpiresAt: organization.planExpiresAt,
        plan: organization.plan
      }
    };
  }
}
