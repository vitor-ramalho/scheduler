import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { OrganizationDto } from './dto/organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  create(data: OrganizationDto) {
    const organization = this.organizationRepository.create(data);
    return this.organizationRepository.save(organization);
  }

  findAll() {
    return this.organizationRepository.find();
  }

  async findById(id: string) {
    const organization = await this.organizationRepository.findOne({ where: { id } });
    if (!organization) throw new NotFoundException('Organization not found');
    return organization;
  }

  async update(id: string, data: Partial<OrganizationDto>) {
    const organization = await this.organizationRepository.findOne({ where: { id } });
    if (!organization) throw new NotFoundException('Organization not found');
    Object.assign(organization, data);
    return this.organizationRepository.save(organization);
  }
}
