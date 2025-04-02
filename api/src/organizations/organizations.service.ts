import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { OrganizationDto } from './dto/organization.dto';
import { Plan } from '../plans/entities/plan.entity';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) {}

  create(data: OrganizationDto) {
    const organization = this.organizationRepository.create({
      ...data,
      plan: {
        id: data.planId,
      },
    });
    return this.organizationRepository.save(organization);
  }

  findAll() {
    return this.organizationRepository.find();
  }

  async findById(id: string) {
    const organization = await this.organizationRepository.findOne({
      where: { id },
    });
    if (!organization) throw new NotFoundException('Organization not found');
    return organization;
  }

  async update(id: string, updateData: UpdateOrganizationDto) {
    const organization = await this.organizationRepository.findOne({
      where: { id },
    });
    if (!organization) throw new NotFoundException('Organization not found');

    if (updateData.planId) {
      const plan = await this.planRepository.findOne({
        where: { id: updateData.planId },
      });
      if (!plan) throw new NotFoundException('Plan not found');
      organization.plan = plan;
    }

    Object.assign(organization, updateData);
    return this.organizationRepository.save(organization);
  }
}
