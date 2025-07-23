import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ResourceService } from './resource.service';

@ApiTags('resources')
@Controller('resources')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Get('available')
  @ApiOperation({ summary: 'Get available rooms for a time slot' })
  @ApiQuery({ name: 'startTime', description: 'Start time (ISO format)', example: '2025-08-22T14:00:00.000Z' })
  @ApiQuery({ name: 'endTime', description: 'End time (ISO format)', example: '2025-08-24T16:00:00.000Z' })
  @ApiResponse({ status: 200, description: 'Available rooms retrieved successfully' })
  findAvailable(@Query('startTime') startTime: string, @Query('endTime') endTime: string) {
    return this.resourceService.findAvailable(new Date(startTime), new Date(endTime));
  }
} 