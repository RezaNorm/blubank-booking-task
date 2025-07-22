import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetBookingsByResourceQuery } from '../impl/get-bookings-by-resource.query';
import { IBookingRepository, BOOKING_REPOSITORY } from '../../repositories/booking.repository.interface';
import { Booking } from '../../entity/booking.entity';

@QueryHandler(GetBookingsByResourceQuery)
export class GetBookingsByResourceHandler implements IQueryHandler<GetBookingsByResourceQuery> {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: IBookingRepository,
  ) {}

  async execute(query: GetBookingsByResourceQuery): Promise<Booking[]> {
    return this.bookingRepository.findBookingsForResource(query.resourceId);
  }
} 