import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBookingsByResourceQuery } from './get-bookings-by-resource.query';
import { BookingService } from '../booking.service';
import { Booking } from '../entity/booking.entity';

@QueryHandler(GetBookingsByResourceQuery)
export class GetBookingsByResourceHandler implements IQueryHandler<GetBookingsByResourceQuery> {
  constructor(private readonly bookingService: BookingService) {}

  async execute(query: GetBookingsByResourceQuery): Promise<Booking[]> {
    return this.bookingService.findByResource(query.resourceId);
  }
} 