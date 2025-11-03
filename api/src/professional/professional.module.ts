import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Professional } from './entities/professional.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { ProfessionalService } from './professional.service';
import { ProfessionalController } from './professional.controller';
import { OrganizationEnabledGuard } from '../common/guards/organization-enabled.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Professional, Organization])],
  controllers: [ProfessionalController],
  providers: [ProfessionalService, OrganizationEnabledGuard],
  exports: [TypeOrmModule],
})
export class ProfessionalModule {}
