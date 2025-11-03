import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../organizations/entities/organization.entity';
import { User } from '../users/entities/user.entity';
import { Appointment } from '../appointments/entities/appointment.entity';

@Injectable()
export class BackofficeService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async getAllOrganizations() {
    const organizations = await this.organizationRepository
      .createQueryBuilder('organization')
      .leftJoinAndSelect('organization.users', 'users')
      .leftJoinAndSelect('organization.clients', 'clients')
      .leftJoinAndSelect('organization.appointments', 'appointments')
      .select([
        'organization.id',
        'organization.name',
        'organization.slug',
        'organization.identifier',
        'organization.phone',
        'organization.email',
        'organization.enabled',
        'organization.createdAt',
        'organization.updatedAt',
      ])
      .loadRelationCountAndMap('organization.usersCount', 'organization.users')
      .loadRelationCountAndMap(
        'organization.clientsCount',
        'organization.clients',
      )
      .loadRelationCountAndMap(
        'organization.appointmentsCount',
        'organization.appointments',
      )
      .orderBy('organization.createdAt', 'DESC')
      .getMany();

    return organizations;
  }

  async getOrganizationDetails(id: string) {
    const organization = await this.organizationRepository
      .createQueryBuilder('organization')
      .leftJoinAndSelect('organization.users', 'users')
      .leftJoinAndSelect('organization.clients', 'clients')
      .leftJoinAndSelect('organization.appointments', 'appointments')
      .leftJoinAndSelect('organization.professionals', 'professionals')
      .where('organization.id = :id', { id })
      .getOne();

    if (!organization) {
      throw new Error('Organization not found');
    }

    return organization;
  }

  async enableOrganization(id: string) {
    const organization = await this.organizationRepository.findOne({
      where: { id },
    });

    if (!organization) {
      throw new Error('Organization not found');
    }

    organization.enabled = true;
    await this.organizationRepository.save(organization);

    return {
      message: 'Organization enabled successfully',
      organization,
    };
  }

  async disableOrganization(id: string) {
    const organization = await this.organizationRepository.findOne({
      where: { id },
    });

    if (!organization) {
      throw new Error('Organization not found');
    }

    organization.enabled = false;
    await this.organizationRepository.save(organization);

    return {
      message: 'Organization disabled successfully',
      organization,
    };
  }

  async getStats() {
    const [
      totalOrganizations,
      enabledOrganizations,
      disabledOrganizations,
      totalUsers,
      totalAppointments,
    ] = await Promise.all([
      this.organizationRepository.count(),
      this.organizationRepository.count({ where: { enabled: true } }),
      this.organizationRepository.count({ where: { enabled: false } }),
      this.userRepository.count(),
      this.appointmentRepository.count(),
    ]);

    return {
      totalOrganizations,
      enabledOrganizations,
      disabledOrganizations,
      totalUsers,
      totalAppointments,
    };
  }
}
