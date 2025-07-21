import { Controller, Post, Get, Param, Body, Patch, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreateBookingCommand } from './commands/create-booking.command';
import { ConfirmBookingCommand } from './commands/confirm-booking.command';
import { CancelBookingCommand } from './commands/cancel-booking.command';
import { GetBookingByIdQuery } from './queries/get-booking-by-id.query';
import { GetBookingsByUserQuery } from './queries/get-bookings-by-user.query';
import { GetBookingsByResourceQuery } from './queries/get-bookings-by-resource.query';
import { GetAllBookingsQuery } from './queries/get-all-bookings.query';

@ApiTags('bookings')
@Controller('bookings')
export class BookingController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Room already booked or invalid data' })
  create(@Body() booking: CreateBookingDto) {
    return this.commandBus.execute(
      new CreateBookingCommand(
        booking.userId,
        booking.resourceId,
        booking.startTime,
        booking.endTime,
      ),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking details by ID' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Booking details retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  findOne(@Param('id') id: number) {
    return this.queryBus.execute(new GetBookingByIdQuery(id));
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookings or filter by user/resource' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiQuery({ name: 'resourceId', required: false, description: 'Filter by room ID' })
  @ApiResponse({ status: 200, description: 'Bookings retrieved successfully' })
  findAll(@Query('userId') userId?: number, @Query('resourceId') resourceId?: number) {
    if (userId) return this.queryBus.execute(new GetBookingsByUserQuery(userId));
    if (resourceId) return this.queryBus.execute(new GetBookingsByResourceQuery(resourceId));
    return this.queryBus.execute(new GetAllBookingsQuery());
  }

  @Patch(':id/confirm')
  @ApiOperation({ summary: 'Confirm a pending booking' })
  @ApiParam({ name: 'id', description: 'Booking ID to confirm' })
  @ApiResponse({ status: 200, description: 'Booking confirmed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Cannot confirm booking' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  confirm(@Param('id') id: number) {
    return this.commandBus.execute(new ConfirmBookingCommand(id));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiParam({ name: 'id', description: 'Booking ID to cancel' })
  @ApiResponse({ status: 200, description: 'Booking cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  cancel(@Param('id') id: number) {
    return this.commandBus.execute(new CancelBookingCommand(id));
  }
} 