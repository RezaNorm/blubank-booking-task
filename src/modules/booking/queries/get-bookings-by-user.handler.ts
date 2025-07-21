import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBookingsByUserQuery } from './get-bookings-by-user.query';
import { BookingService } from '../booking.service';
import { Booking } from '../entity/booking.entity';

@QueryHandler(GetBookingsByUserQuery)
export class GetBookingsByUserHandler implements IQueryHandler<GetBookingsByUserQuery> {
  constructor(private readonly bookingService: BookingService) {}

  async execute(query: GetBookingsByUserQuery): Promise<Booking[]> {
    return this.bookingService.findByUser(query.userId);
  }
} 