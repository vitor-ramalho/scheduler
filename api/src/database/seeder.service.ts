import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Organization } from '../organizations/entities/organization.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
  ) {}

  async createInitialAdmin() {
    // Check if admin already exists
    const existingAdmin = await this.userRepository.findOne({
      where: { role: 'admin' },
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin organization
    const adminOrg = this.organizationRepository.create({
      name: 'System Administration',
      slug: 'system-admin',
      enabled: true,
    });
    await this.organizationRepository.save(adminOrg);

    // Create admin user
    const hashedPassword = await bcrypt.hash(
      process.env.INITIAL_ADMIN_PASSWORD || 'admin123',
      10,
    );

    const adminUser = this.userRepository.create({
      email: process.env.INITIAL_ADMIN_EMAIL || 'admin@system.local',
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Administrator',
      role: 'admin',
      organization: adminOrg,
    });

    await this.userRepository.save(adminUser);
    console.log('Initial admin user created successfully');
  }
}
