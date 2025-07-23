import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBookingsInTimeRangeQuery } from '../impl/get-bookings-in-time-range.query';
import { Inject } from '@nestjs/common';
import { BOOKING_REPOSITORY, IBookingRepository } from '../../repositories/booking.repository.interface';

@QueryHandler(GetBookingsInTimeRangeQuery)
export class GetBookingsInTimeRangeHandler implements IQueryHandler<GetBookingsInTimeRangeQuery> {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: IBookingRepository,
  ) {}

  async execute(query: GetBookingsInTimeRangeQuery) {
    return this.bookingRepository.findBookingsInTimeRange(
      query.startTime,
      query.endTime,
      query.resourceId
    );
  }
}
