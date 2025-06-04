import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from './entities/plan.entity';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) {}

  findAll() {
    return this.planRepository.find();
  }

  async findOne(id: string) {
    const plan = await this.planRepository.findOne({ where: { id } });
    if (!plan) throw new NotFoundException('Plan not found');
    return plan;
  }
}
