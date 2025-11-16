import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly prisma: PrismaService) {}

  async healthCheck() {
    try {
      let dbStatus = 'unhealthy';

      try {
        await this.prisma.$queryRaw`SELECT 1`;
        dbStatus = 'healthy';
      } catch (dbError) {
        this.logger.error('Database health check failed:', dbError);
        dbStatus = 'unhealthy';
      }

      const detailedHealth = {
        success: true,
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0',

        system: {
          platform: process.platform,
          nodeVersion: process.version,
          memory: {
            used:
              Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
            total:
              Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
            external:
              Math.round(process.memoryUsage().external / 1024 / 1024) + ' MB',
            rss: Math.round(process.memoryUsage().rss / 1024 / 1024) + ' MB',
          },
          cpu: process.cpuUsage(),
        },

        services: {
          api: 'healthy',
          database: dbStatus,
        },
      };

      this.logger.log('Detailed health check successful');
      return detailedHealth;
    } catch (error) {
      this.logger.error('Health check failed:', error.stack);
      return {
        success: false,
        status: 'ERROR',
        error: error.message,
      };
    }
  }
}
