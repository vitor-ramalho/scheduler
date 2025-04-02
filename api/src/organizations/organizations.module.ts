import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { Organization } from './entities/organization.entity';
import { PlansModule } from 'src/plans/plans.module';
import { Plan } from 'src/plans/entities/plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, Plan]), PlansModule],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
