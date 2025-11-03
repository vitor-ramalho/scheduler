import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Organization } from '../organizations/entities/organization.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminManagementService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
  ) {}

  async getAdmins() {
    const admins = await this.userRepository.find({
      where: { role: 'admin' },
      select: ['id', 'email', 'firstName', 'lastName', 'createdAt'],
      relations: ['organization'],
    });

    return admins.map((admin) => ({
      id: admin.id,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      organization: admin.organization?.name || 'System Administration',
      createdAt: admin.createdAt,
    }));
  }

  async createAdmin(createAdminDto: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createAdminDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Get or create system admin organization
    let adminOrg = await this.organizationRepository.findOne({
      where: { slug: 'system-admin' },
    });

    if (!adminOrg) {
      adminOrg = this.organizationRepository.create({
        name: 'System Administration',
        slug: 'system-admin',
        enabled: true,
      });
      await this.organizationRepository.save(adminOrg);
    }

    // Hash password
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

    // Create admin user
    const adminUser = this.userRepository.create({
      email: createAdminDto.email,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      password: hashedPassword,
      firstName: createAdminDto.firstName,
      lastName: createAdminDto.lastName,
      role: 'admin',
      organization: adminOrg,
    });

    const savedUser = await this.userRepository.save(adminUser);

    // Return without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = savedUser;
    return {
      ...result,
      message: 'Admin user created successfully',
    };
  }

  async removeAdmin(id: string) {
    const admin = await this.userRepository.findOne({
      where: { id, role: 'admin' },
    });

    if (!admin) {
      throw new NotFoundException('Admin user not found');
    }

    // Prevent removing the last admin
    const adminCount = await this.userRepository.count({
      where: { role: 'admin' },
    });

    if (adminCount <= 1) {
      throw new BadRequestException('Cannot remove the last admin user');
    }

    await this.userRepository.remove(admin);

    return {
      message: 'Admin user removed successfully',
    };
  }
}
