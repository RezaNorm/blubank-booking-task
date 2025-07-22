import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource } from '../entity/resource.entity';
import { FindAvailableResourcesQuery } from './find-available-resources.query';
import { BookingService } from '../../booking/booking.service';

@QueryHandler(FindAvailableResourcesQuery)
export class FindAvailableResourcesHandler implements IQueryHandler<FindAvailableResourcesQuery> {
  constructor(
    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>,
    private bookingService: BookingService,
  ) {}

  async execute(query: FindAvailableResourcesQuery): Promise<Resource[]> {
    const { startTime, endTime } = query;
    
    const resources = await this.resourceRepository.find();
    const bookings = await this.bookingService.findAllConfirmed();
    
    return resources.filter(resource => {
      const resourceBookings = bookings.filter(b => b.resource.id === resource.id);
      const hasOverlap = resourceBookings.some(booking =>
        this.bookingService.isBookingOverlap(
          { start: new Date(booking.startTime), end: new Date(booking.endTime) },
          { start: startTime, end: endTime }
        )
      );
      return !hasOverlap;
    });
  }
}
