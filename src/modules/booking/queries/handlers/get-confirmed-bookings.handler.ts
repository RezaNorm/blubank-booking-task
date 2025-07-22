import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetConfirmedBookingsQuery } from '../impl/get-confirmed-bookings.query';
import { Booking } from '../../entity/booking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingStatus } from '../../entity/booking.entity';

@QueryHandler(GetConfirmedBookingsQuery)
export class GetConfirmedBookingsHandler implements IQueryHandler<GetConfirmedBookingsQuery> {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async execute(query: GetConfirmedBookingsQuery): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { status: BookingStatus.CONFIRMED },
      relations: ['resource'],
    });
  }
}
