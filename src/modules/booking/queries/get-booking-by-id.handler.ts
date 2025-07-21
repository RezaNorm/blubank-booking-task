import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBookingByIdQuery } from './get-booking-by-id.query';
import { BookingService } from '../booking.service';
import { Booking } from '../entity/booking.entity';

@QueryHandler(GetBookingByIdQuery)
export class GetBookingByIdHandler implements IQueryHandler<GetBookingByIdQuery> {
  constructor(private readonly bookingService: BookingService) {}

  async execute(query: GetBookingByIdQuery): Promise<Booking> {
    return this.bookingService.findOne(query.id);
  }
} 