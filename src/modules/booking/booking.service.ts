import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Booking } from './entity/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingRange } from './interfaces/booking-range.interface';

// Commands
import { CreateBookingCommand } from './commands/impl/create-booking.command';
import { ConfirmBookingCommand } from './commands/impl/confirm-booking.command';
import { CancelBookingCommand } from './commands/impl/cancel-booking.command';

// Queries
import { GetBookingByIdQuery } from './queries/impl/get-booking-by-id.query';
import { GetBookingsByUserQuery } from './queries/impl/get-bookings-by-user.query';
import { GetBookingsByResourceQuery } from './queries/impl/get-bookings-by-resource.query';
import { GetAllBookingsQuery } from './queries/impl/get-all-bookings.query';
import { GetConfirmedBookingsQuery } from './queries/impl/get-confirmed-bookings.query';

@Injectable()
export class BookingService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * Creates a new booking using CQRS command
   * @param bookingData The booking data
   * @returns The created booking
   */
  async createBooking(bookingData: CreateBookingDto): Promise<Booking> {
    return this.commandBus.execute(
      new CreateBookingCommand(
        bookingData.userId,
        bookingData.resourceId,
        bookingData.startTime,
        bookingData.endTime,
      ),
    );
  }

  /**
   * Gets a booking by ID using CQRS query
   * @param id The booking ID
   * @returns The booking if found
   */
  async getBookingById(id: number): Promise<Booking> {
    return this.queryBus.execute(new GetBookingByIdQuery(id));
  }

  /**
   * Gets all bookings, optionally filtered by user or resource
   * @param userId Optional user ID to filter by
   * @param resourceId Optional resource ID to filter by
   * @returns Array of bookings
   */
  async getAllBookings(userId?: number, resourceId?: number): Promise<Booking[]> {
    if (userId) return this.queryBus.execute(new GetBookingsByUserQuery(userId));
    if (resourceId) return this.queryBus.execute(new GetBookingsByResourceQuery(resourceId));
    return this.queryBus.execute(new GetAllBookingsQuery());
  }

  /**
   * Confirms a pending booking using CQRS command
   * @param id The booking ID to confirm
   * @returns The confirmed booking
   */
  async confirmBooking(id: number): Promise<Booking> {
    return this.commandBus.execute(new ConfirmBookingCommand(id));
  }

  /**
   * Cancels a booking using CQRS command
   * @param id The booking ID to cancel
   * @returns The cancelled booking
   */
  async cancelBooking(id: number): Promise<Booking> {
    return this.commandBus.execute(new CancelBookingCommand(id));
  }

  /**
   * Utility method to check if two booking ranges overlap
   * @param a First booking range
   * @param b Second booking range
   * @returns True if the ranges overlap, false otherwise
   */
  public isBookingOverlap(a: BookingRange, b: BookingRange): boolean {
    return a.start < b.end && a.end > b.start;
  }
  
  /**
   * Gets all confirmed bookings
   * @returns Array of confirmed bookings
   */
  async getConfirmedBookings(): Promise<Booking[]> {
    return this.queryBus.execute(new GetConfirmedBookingsQuery());
  }
} 