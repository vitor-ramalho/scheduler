import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminManagementController } from './admin-management.controller';
import { AdminManagementService } from './admin-management.service';
import { User } from '../users/entities/user.entity';
import { Organization } from '../organizations/entities/organization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Organization])],
  controllers: [AdminManagementController],
  providers: [AdminManagementService],
  exports: [AdminManagementService],
})
export class AdminManagementModule {}
