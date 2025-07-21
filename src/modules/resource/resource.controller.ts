import { Controller, Post, Get, Param, Body, Query, InternalServerErrorException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ResourceService } from './resource.service';
import { CreateResourceDto } from './dto/create-resource.dto';

@ApiTags('resources')
@Controller('resources')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Get('available')
  @ApiOperation({ summary: 'Get available rooms for a time slot' })
  @ApiQuery({ name: 'startTime', description: 'Start time (ISO format)', example: '2025-07-22T14:00:00.000Z' })
  @ApiQuery({ name: 'endTime', description: 'End time (ISO format)', example: '2025-07-24T16:00:00.000Z' })
  @ApiResponse({ status: 200, description: 'Available rooms retrieved successfully' })
  findAvailable(@Query('startTime') startTime: string, @Query('endTime') endTime: string) {
    return this.resourceService.findAvailable(new Date(startTime), new Date(endTime));
  }

  @Get(':id/reserved-dates')
  @ApiOperation({ summary: 'Get reserved dates for a specific room' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiResponse({ status: 200, description: 'Reserved dates retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  getReservedDates(@Param('id') id: number) {
    return this.resourceService.getReservedDates(id);
  }
} 