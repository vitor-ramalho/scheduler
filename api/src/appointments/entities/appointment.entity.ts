import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { Professional } from '../../professional/entities/professional.entity';
import { Organization } from '../../organizations/entities/organization.entity';

@Entity({ name: 'appointments' })
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Client, (client) => client.appointments, { eager: true })
  client: Client;

  @OneToOne(() => Professional, (professional) => professional.appointments)
  @JoinColumn()
  professional: Professional;

  @ManyToOne(() => Organization, (organization) => organization.appointments, {
    eager: true,
  })
  organization: Organization;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
