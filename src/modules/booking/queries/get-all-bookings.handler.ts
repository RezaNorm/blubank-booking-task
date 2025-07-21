import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllBookingsQuery } from './get-all-bookings.query';
import { BookingService } from '../booking.service';
import { Booking } from '../entity/booking.entity';

@QueryHandler(GetAllBookingsQuery)
export class GetAllBookingsHandler implements IQueryHandler<GetAllBookingsQuery> {
  constructor(private readonly bookingService: BookingService) {}

  async execute(query: GetAllBookingsQuery): Promise<Booking[]> {
    return this.bookingService.findAll();
  }
} 