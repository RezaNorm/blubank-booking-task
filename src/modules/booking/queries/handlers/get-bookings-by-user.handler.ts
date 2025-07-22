import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetBookingsByUserQuery } from '../impl/get-bookings-by-user.query';
import { IBookingRepository, BOOKING_REPOSITORY } from '../../repositories/booking.repository.interface';
import { Booking } from '../../entity/booking.entity';

@QueryHandler(GetBookingsByUserQuery)
export class GetBookingsByUserHandler implements IQueryHandler<GetBookingsByUserQuery> {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: IBookingRepository,
  ) {}

  async execute(query: GetBookingsByUserQuery): Promise<Booking[]> {
    return this.bookingRepository.findBookingsByUser(query.userId);
  }
} 