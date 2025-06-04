import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Organization } from '../organizations/entities/organization.entity';
import { PaymentService } from './payment.service';
import { ConfigService } from '@nestjs/config';
import { SubscriptionNotificationService } from './subscription-notification.service';

@Injectable()
export class SubscriptionRenewalService {
  private readonly logger = new Logger(SubscriptionRenewalService.name);

  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    private readonly paymentService: PaymentService,
    private readonly configService: ConfigService,
    private readonly notificationService: SubscriptionNotificationService,
  ) {}

  /**
   * Check for subscriptions that need renewal daily at midnight
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleSubscriptionRenewals() {
    this.logger.log('Checking for subscriptions that need renewal...');

    // Calculate date for subscriptions expiring in the next 3 days
    const expirationThreshold = new Date();
    expirationThreshold.setDate(expirationThreshold.getDate() + 3);

    // Find organizations with active plans that expire soon
    const organizationsToRenew = await this.organizationRepository.find({
      where: {
        isPlanActive: true,
        planExpiresAt: LessThan(expirationThreshold),
      },
      relations: ['plan'],
    });

    this.logger.log(`Found ${organizationsToRenew.length} subscriptions that need renewal`);

    // Process each organization for renewal
    for (const organization of organizationsToRenew) {
      try {
        await this.processRenewal(organization);
      } catch (error) {
        this.logger.error(
          `Failed to process renewal for organization ${organization.id}: ${error.message}`,
          error.stack,
        );
      }
    }
  }

  /**
   * Process renewal for a specific organization
   */
  private async processRenewal(organization: Organization) {
    this.logger.log(`Processing renewal for organization ${organization.id}`);

    // Skip if no plan is attached
    if (!organization.plan) {
      this.logger.warn(`No plan found for organization ${organization.id}`);
      return;
    }

    try {
      // Get a user from this organization to use for payment
      const users = await organization.users;
      if (!users || users.length === 0) {
        this.logger.warn(`No users found for organization ${organization.id}`);
        return;
      }

      const userId = users[0].id;

      // Generate a new QR code payment for renewal
      const orderId = `renewal_${organization.id}_${Date.now()}`;
      const description = `Renewal for ${organization.plan.name} plan`;

      const payment = await this.paymentService.generateQrCodePayment({
        amount: Number(organization.plan.price),
        expiredIn: 72 * 3600, // 3 days expiration
        description,
        userId,
        organizationId: organization.id,
      });

      // Update organization with new payment ID
      organization.paymentId = payment.id;
      await this.organizationRepository.save(organization);

      // Send email notification about renewal (to be implemented)
      this.sendRenewalNotification(organization, payment);

      this.logger.log(`Renewal payment created for organization ${organization.id}`);
    } catch (error) {
      this.logger.error(
        `Failed to create renewal payment for organization ${organization.id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Send renewal notification to organization admins
   */
  private async sendRenewalNotification(organization: Organization, payment: any) {
    this.logger.log(`Sending renewal notification for organization ${organization.id}`);
    
    try {
      // Use the notification service to send a subscription expiring notification
      await this.notificationService.createSubscriptionExpiringNotification(
        organization,
        3 // 3 days remaining
      );
      
      this.logger.log(`Renewal notification sent for organization ${organization.id}`);
    } catch (error) {
      this.logger.error(
        `Failed to send renewal notification for organization ${organization.id}: ${error.message}`,
        error.stack,
      );
    }
  }
}