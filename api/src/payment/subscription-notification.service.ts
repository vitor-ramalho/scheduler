import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../organizations/entities/organization.entity';
import { User } from '../users/entities/user.entity';

export enum NotificationType {
  SUBSCRIPTION_CREATED = 'subscription_created',
  SUBSCRIPTION_RENEWED = 'subscription_renewed',
  SUBSCRIPTION_EXPIRING = 'subscription_expiring',
  SUBSCRIPTION_EXPIRED = 'subscription_expired',
  SUBSCRIPTION_CANCELLED = 'subscription_cancelled',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed',
}

interface NotificationData {
  type: NotificationType;
  organizationId: string;
  userId?: string;
  title: string;
  message: string;
  additionalData?: Record<string, any>;
}

@Injectable()
export class SubscriptionNotificationService {
  private readonly logger = new Logger(SubscriptionNotificationService.name);

  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Send a notification for a subscription event
   */
  async sendNotification(notification: NotificationData) {
    this.logger.log(`Sending notification: ${notification.type} for organization ${notification.organizationId}`);
    
    try {
      // If userId is provided, send notification to specific user
      if (notification.userId) {
        await this.notifyUser(notification);
      } else {
        // Otherwise, notify all admin users in the organization
        await this.notifyOrganizationAdmins(notification);
      }
      
      // Store notification in database (to be implemented with a notification entity)
      await this.storeNotification(notification);
      
      // Log successful notification
      this.logger.log(`Successfully sent notification: ${notification.type} for organization ${notification.organizationId}`);
    } catch (error) {
      this.logger.error(`Failed to send notification: ${error.message}`, error.stack);
    }
  }

  /**
   * Notify a specific user
   */
  private async notifyUser(notification: NotificationData) {
    if (!notification.userId) return;
    
    const user = await this.userRepository.findOne({
      where: { id: notification.userId },
    });
    
    if (!user || !user.email) {
      this.logger.warn(`Cannot notify user ${notification.userId}: User not found or no email`);
      return;
    }
    
    // In a real implementation, this would send an email or push notification
    this.logger.log(`Would send email to ${user.email} with title: ${notification.title}`);
    
    // Placeholder for email sending functionality
    // await this.emailService.sendEmail({
    //   to: user.email,
    //   subject: notification.title,
    //   text: notification.message,
    // });
  }

  /**
   * Notify all admin users in an organization
   */
  private async notifyOrganizationAdmins(notification: NotificationData) {
    const organizationId = notification.organizationId;
    
    // Find all admin users in the organization
    const admins = await this.userRepository.find({
      where: {
        organizationId,
        role: 'admin', // Assuming 'admin' is the role for organization admins
      },
    });
    
    if (admins.length === 0) {
      this.logger.warn(`No admin users found for organization ${organizationId}`);
      return;
    }
    
    // Notify each admin
    for (const admin of admins) {
      if (admin.email) {
        // In a real implementation, this would send an email or push notification
        this.logger.log(`Would send email to ${admin.email} with title: ${notification.title}`);
        
        // Placeholder for email sending functionality
        // await this.emailService.sendEmail({
        //   to: admin.email,
        //   subject: notification.title,
        //   text: notification.message,
        // });
      }
    }
  }

  /**
   * Store notification in database for later retrieval
   */
  private async storeNotification(notification: NotificationData) {
    // This would store the notification in a database table
    // await this.notificationRepository.save({
    //   type: notification.type,
    //   organizationId: notification.organizationId,
    //   userId: notification.userId,
    //   title: notification.title,
    //   message: notification.message,
    //   data: notification.additionalData,
    //   isRead: false,
    //   createdAt: new Date(),
    // });
    
    // For now, just log that we would store it
    this.logger.log(`Would store notification in database: ${notification.type}`);
  }

  /**
   * Create a subscription expiring notification
   */
  async createSubscriptionExpiringNotification(organization: Organization, daysRemaining: number) {
    return this.sendNotification({
      type: NotificationType.SUBSCRIPTION_EXPIRING,
      organizationId: organization.id,
      title: 'Subscription Expiring Soon',
      message: `Your subscription will expire in ${daysRemaining} days. Please renew to avoid service interruption.`,
      additionalData: {
        planName: organization.plan?.name,
        expiresAt: organization.planExpiresAt,
        daysRemaining,
      },
    });
  }

  /**
   * Create a subscription renewed notification
   */
  async createSubscriptionRenewedNotification(organization: Organization) {
    return this.sendNotification({
      type: NotificationType.SUBSCRIPTION_RENEWED,
      organizationId: organization.id,
      title: 'Subscription Successfully Renewed',
      message: `Your subscription has been successfully renewed. Your next billing date is ${organization.planExpiresAt}.`,
      additionalData: {
        planName: organization.plan?.name,
        expiresAt: organization.planExpiresAt,
      },
    });
  }

  /**
   * Create a payment success notification
   */
  async createPaymentSuccessNotification(organization: Organization, paymentId: string) {
    return this.sendNotification({
      type: NotificationType.PAYMENT_SUCCESS,
      organizationId: organization.id,
      title: 'Payment Successful',
      message: `Your payment for subscription renewal has been processed successfully.`,
      additionalData: {
        planName: organization.plan?.name,
        paymentId,
        amount: organization.plan?.price,
      },
    });
  }

  /**
   * Create a payment failed notification
   */
  async createPaymentFailedNotification(organization: Organization, paymentId: string) {
    return this.sendNotification({
      type: NotificationType.PAYMENT_FAILED,
      organizationId: organization.id,
      title: 'Payment Failed',
      message: `Your payment for subscription renewal has failed. Please update your payment information.`,
      additionalData: {
        planName: organization.plan?.name,
        paymentId,
        amount: organization.plan?.price,
      },
    });
  }
}
