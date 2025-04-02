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

  create(planData: Partial<Plan>) {
    const plan = this.planRepository.create(planData);
    return this.planRepository.save(plan);
  }

  findAll() {
    return this.planRepository.find();
  }

  async findOne(id: string) {
    const plan = await this.planRepository.findOne({ where: { id } });
    if (!plan) throw new NotFoundException('Plan not found');
    return plan;
  }

  async update(id: string, updateData: Partial<Plan>) {
    const plan = await this.findOne(id);
    Object.assign(plan, updateData);
    return this.planRepository.save(plan);
  }

  async remove(id: string) {
    const plan = await this.findOne(id);
    return this.planRepository.remove(plan);
  }
}
