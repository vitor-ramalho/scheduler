import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Client } from '../../clients/entities/client.entity';
import { Professional } from '../../professional/entities/professional.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';

@Entity({ name: 'organizations' })
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  identifier?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ default: false })
  enabled: boolean;

  @OneToMany(() => User, (user) => user.organization)
  users: User[];

  @OneToMany(() => Client, (client) => client.organization)
  clients: Client[];

  @OneToMany(() => Professional, (professional) => professional.organization)
  professionals: Professional[];

  @OneToMany(() => Appointment, (appointment) => appointment.organization)
  appointments: Appointment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
