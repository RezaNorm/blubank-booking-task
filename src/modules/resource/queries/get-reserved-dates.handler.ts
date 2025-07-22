import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource } from '../entity/resource.entity';
import { GetReservedDatesQuery } from './get-reserved-dates.query';
import { BookingService } from '../../booking/booking.service';

@QueryHandler(GetReservedDatesQuery)
export class GetReservedDatesHandler implements IQueryHandler<GetReservedDatesQuery> {
  constructor(
    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>,
    private bookingService: BookingService,
  ) {}

  async execute(query: GetReservedDatesQuery) {
    const { resourceId } = query;
    
    // Verify resource exists
    const resource = await this.resourceRepository.findOne({ where: { id: resourceId } });
    if (!resource) {
      throw new Error('Resource not found');
    }
    
    const bookings = await this.bookingService.findBookingsForResource(resourceId);
    return this.bookingService.getReservedDateRanges(
      bookings.map(b => ({
        start: new Date(b.startTime),
        end: new Date(b.endTime),
      }))
    );
  }
}
