import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Basic health check' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
    };
  }

  @Get('detailed')
  @ApiOperation({ summary: 'Detailed health check with dependencies' })
  @ApiResponse({ status: 200, description: 'Detailed health information' })
  async getDetailedHealth() {
    const startTime = Date.now();

    // Check database connection
    let dbStatus = 'healthy';
    let dbResponseTime = 0;

    try {
      const dbStart = Date.now();
      await this.userRepository.count();
      dbResponseTime = Date.now() - dbStart;
    } catch (error) {
      dbStatus = 'unhealthy';
    }

    const responseTime = Date.now() - startTime;

    return {
      status: dbStatus === 'healthy' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      checks: {
        database: {
          status: dbStatus,
          responseTime: `${dbResponseTime}ms`,
        },
        memory: {
          usage: process.memoryUsage(),
          limit: '512MB', // Adjust based on your deployment
        },
        cpu: {
          usage: process.cpuUsage(),
        },
      },
      responseTime: `${responseTime}ms`,
    };
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness probe for Kubernetes' })
  @ApiResponse({ status: 200, description: 'Service is ready' })
  async getReadiness() {
    try {
      // Check critical dependencies
      await this.userRepository.count();

      return {
        status: 'ready',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'not ready',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
