import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health-check')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Perform a detailed system health check',
    description:
      'Returns detailed information about the API health, uptime, environment, and system statistics including memory and CPU usage.',
  })
  @ApiResponse({
    status: 200,
    description: 'The system is healthy and responding as expected.',
    schema: {
      example: {
        success: true,
        status: 'OK',
        timestamp: '2025-11-06T16:32:10.123Z',
        uptime: 12345.67,
        environment: 'development',
        version: '1.0.0',
        system: {
          platform: 'linux',
          nodeVersion: 'v18.17.1',
          memory: {
            used: '45 MB',
            total: '64 MB',
            external: '3 MB',
            rss: '120 MB',
          },
          cpu: {
            user: 102000,
            system: 30000,
          },
        },
        services: {
          api: 'healthy',
          database: 'healthy',
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error — the health check failed.',
    schema: {
      example: {
        success: false,
        status: 'ERROR',
        error: 'Health check failed due to unexpected issue.',
      },
    },
  })
  healthCheck() {
    return this.appService.healthCheck();
  }
}
