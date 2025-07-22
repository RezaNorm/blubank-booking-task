import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllBookingsQuery } from '../impl/get-all-bookings.query';
import { IBookingRepository, BOOKING_REPOSITORY } from '../../repositories/booking.repository.interface';
import { Booking } from '../../entity/booking.entity';

@QueryHandler(GetAllBookingsQuery)
export class GetAllBookingsHandler implements IQueryHandler<GetAllBookingsQuery> {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: IBookingRepository,
  ) {}

  async execute(query: GetAllBookingsQuery): Promise<Booking[]> {
    return this.bookingRepository.findWithRelations({
      relations: ['user', 'resource'],
      order: { createdAt: 'DESC' },
    });
  }
} 