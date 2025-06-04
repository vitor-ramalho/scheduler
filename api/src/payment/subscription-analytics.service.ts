import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Organization } from '../organizations/entities/organization.entity';
import { Subscription } from './entities/subscription.entity';

@Injectable()
export class SubscriptionAnalyticsService {
  private readonly logger = new Logger(SubscriptionAnalyticsService.name);

  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  /**
   * Get summary metrics for all subscriptions
   */
  async getSubscriptionSummary() {
    const [
      totalOrganizations,
      activeSubscriptions,
      expiringWithin30Days,
      renewedLast30Days,
      cancelledLast30Days,
    ] = await Promise.all([
      this.organizationRepository.count(),
      this.organizationRepository.count({ where: { isPlanActive: true } }),
      this.getExpiringSubscriptions(30),
      this.getRenewedSubscriptions(30),
      this.getCancelledSubscriptions(30),
    ]);

    // Calculate revenue metrics
    const revenueMetrics = await this.calculateRevenueMetrics();

    return {
      totalOrganizations,
      activeSubscriptions,
      expiringWithin30Days,
      renewedLast30Days,
      cancelledLast30Days,
      revenueMetrics,
    };
  }

  /**
   * Get subscriptions expiring within specified days
   */
  async getExpiringSubscriptions(days: number) {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    return this.organizationRepository.count({
      where: {
        isPlanActive: true,
        planExpiresAt: Between(startDate, endDate),
      },
    });
  }

  /**
   * Get subscriptions renewed in the last specified days
   */
  async getRenewedSubscriptions(days: number) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.subscriptionRepository.count({
      where: {
        status: 'active',
        updatedAt: MoreThanOrEqual(startDate),
        isRenewal: true,
      },
    });
  }

  /**
   * Get subscriptions cancelled in the last specified days
   */
  async getCancelledSubscriptions(days: number) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.subscriptionRepository.count({
      where: {
        status: 'cancelled',
        updatedAt: MoreThanOrEqual(startDate),
      },
    });
  }

  /**
   * Calculate revenue metrics
   */
  async calculateRevenueMetrics() {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    // Get current month's revenue
    const currentMonthSubscriptions = await this.subscriptionRepository.find({
      where: {
        status: 'active',
        createdAt: Between(firstDayOfMonth, lastDayOfMonth),
      },
      relations: ['plan'],
    });
    
    const currentMonthRevenue = currentMonthSubscriptions.reduce(
      (sum, subscription) => sum + Number(subscription.plan?.price || 0),
      0,
    );

    // Get previous month's revenue
    const prevMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const prevMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
    
    const prevMonthSubscriptions = await this.subscriptionRepository.find({
      where: {
        status: 'active',
        createdAt: Between(prevMonthStart, prevMonthEnd),
      },
      relations: ['plan'],
    });
    
    const prevMonthRevenue = prevMonthSubscriptions.reduce(
      (sum, subscription) => sum + Number(subscription.plan?.price || 0),
      0,
    );

    // Calculate MRR (Monthly Recurring Revenue)
    const activeSubscriptions = await this.subscriptionRepository.find({
      where: { status: 'active' },
      relations: ['plan'],
    });
    
    const mrr = activeSubscriptions.reduce(
      (sum, subscription) => sum + Number(subscription.plan?.price || 0),
      0,
    );

    return {
      currentMonthRevenue,
      prevMonthRevenue,
      mrr,
      growthRate: prevMonthRevenue ? ((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100 : 0,
    };
  }

  /**
   * Get subscription history for a specific organization
   */
  async getOrganizationSubscriptionHistory(organizationId: string) {
    return this.subscriptionRepository.find({
      where: { organizationId },
      relations: ['plan'],
      order: { createdAt: 'DESC' },
    });
  }
}
