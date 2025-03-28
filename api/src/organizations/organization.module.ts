import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { ProfessionalModule } from '../professional/professional.module';

@Module({
  imports: [TypeOrmModule.forFeature([Organization]), ProfessionalModule],
})
export class OrganizationModule {}
