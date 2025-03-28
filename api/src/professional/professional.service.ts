import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Professional } from './entities/professional.entity';
import { ProfessionalDto } from './dto/professional.dto';

@Injectable()
export class ProfessionalService {
  constructor(
    @InjectRepository(Professional)
    private readonly professionalRepository: Repository<Professional>,
  ) {}

  create(data: ProfessionalDto, organizationId: string) {
    const professional = this.professionalRepository.create({
      ...data,
      organization: { id: organizationId },
    });
    return this.professionalRepository.save(professional);
  }

  findAll(organizationId: string) {
    return this.professionalRepository.find({
      where: { organization: { id: organizationId } },
    });
  }

  async update(
    id: string,
    data: Partial<ProfessionalDto>,
    organizationId: string,
  ) {
    const professional = await this.professionalRepository.findOne({
      where: { id, organization: { id: organizationId } },
    });
    if (!professional) throw new NotFoundException('Professional not found');
    Object.assign(professional, data);
    return this.professionalRepository.save(professional);
  }

  async remove(id: string, organizationId: string) {
    const professional = await this.professionalRepository.findOne({
      where: { id, organization: { id: organizationId } },
    });
    if (!professional) throw new NotFoundException('Professional not found');
    return this.professionalRepository.remove(professional);
  }
}
