import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Root & Health')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'API Root & Service Status' })
  @ApiResponse({ status: 200, description: 'Service is online and operational' })
  getRoot() {
    return {
      status: 'online',
      service: 'Cuanly Backend REST API Service',
      version: '1.0.0',
      database: 'Neon PostgreSQL',
      docs: '/api/docs',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check probe' })
  @ApiResponse({ status: 200, description: 'Health check probe' })
  getHealth() {
    return {
      status: 'ok',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }
}
