import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';
import { Plan } from '../../plans/entities/plan.entity';

export type SubscriptionStatus = 'active' | 'inactive' | 'pending' | 'cancelled' | 'expired';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  status: SubscriptionStatus;

  @Column({ name: 'organization_id' })
  organizationId: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ name: 'plan_id' })
  planId: string;

  @ManyToOne(() => Plan)
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @Column({ type: 'varchar', nullable: true })
  paymentId: string;

  @Column({ type: 'boolean', default: false })
  isRenewal: boolean;

  @Column({ type: 'varchar', nullable: true })
  cancelReason: string;

  @Column({ type: 'varchar', nullable: true })
  paymentMethod: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
