import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    organizationId: string;
    email: string;
    role: string;
  };
}

@Injectable()
export class OrganizationEnabledMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    // Skip middleware for backoffice routes
    if (req.path.startsWith('/api/backoffice')) {
      return next();
    }

    // Skip middleware for auth routes (login, register, etc.)
    if (req.path.startsWith('/api/auth')) {
      return next();
    }

    // If user is authenticated, check if organization is enabled
    if (req.user && req.user.organizationId) {
      const organization = await this.organizationRepository.findOne({
        where: { id: req.user.organizationId },
        select: ['enabled'],
      });

      if (!organization || !organization.enabled) {
        throw new ForbiddenException(
          'Organization is disabled. Please contact support.',
        );
      }
    }

    next();
  }
}
