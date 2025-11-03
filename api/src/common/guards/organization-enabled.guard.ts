import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';

@Injectable()
export class OrganizationEnabledGuard implements CanActivate {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const user = request.user;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!user || !user.organizationId) {
      throw new ForbiddenException('User organization not found');
    }

    // Admins globais podem acessar qualquer coisa
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (user.role === 'admin') {
      return true;
    }

    const organization = await this.organizationRepository.findOne({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      where: { id: user.organizationId },
    });

    if (!organization) {
      throw new ForbiddenException('Organization not found');
    }

    if (!organization.enabled) {
      throw new ForbiddenException(
        'Organization is disabled. Please contact support.',
      );
    }

    return true;
  }
}
