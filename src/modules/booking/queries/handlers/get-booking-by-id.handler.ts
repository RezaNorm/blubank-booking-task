import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetBookingByIdQuery } from '../impl/get-booking-by-id.query';
import { IBookingRepository, BOOKING_REPOSITORY } from '../../repositories/booking.repository.interface';
import { Booking } from '../../entity/booking.entity';

@QueryHandler(GetBookingByIdQuery)
export class GetBookingByIdHandler implements IQueryHandler<GetBookingByIdQuery> {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: IBookingRepository,
  ) {}

  async execute(query: GetBookingByIdQuery): Promise<Booking> {
    const booking = await this.bookingRepository.findOneWithRelations({
      where: { id: query.id },
      relations: ['user', 'resource'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }
} 