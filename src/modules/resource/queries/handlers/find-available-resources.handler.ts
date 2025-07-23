import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAvailableResourcesQuery } from '../impl/find-available-resources.query';
import { Resource } from '../../entity/resource.entity';
import { IResourceRepository, RESOURCE_REPOSITORY } from '../../repositories/resource.repository.interface';
import { Inject } from '@nestjs/common';
import { BookingService } from '../../../../modules/booking/booking.service';

@QueryHandler(FindAvailableResourcesQuery)
export class FindAvailableResourcesHandler implements IQueryHandler<FindAvailableResourcesQuery> {
  constructor(
    @Inject(RESOURCE_REPOSITORY)
    private readonly resourceRepository: IResourceRepository,
    private readonly bookingService: BookingService,
  ) {}

  async execute(query: FindAvailableResourcesQuery): Promise<Resource[]> {
    const { startTime, endTime } = query;
    
    // Get all resources
    const resources = await this.resourceRepository.find();
    const availableResources: Resource[] = [];
    
    // Check each resource for availability in the requested time range
    for (const resource of resources) {
      // Get all bookings for this resource that overlap with the requested time range
      const overlappingBookings = await this.bookingService.getBookingsInTimeRange(
        startTime,
        endTime,
        resource.id
      );
      
      // Filter for only confirmed bookings
      const confirmedOverlappingBookings = overlappingBookings.filter(
        booking => booking.status === 'confirmed'
      );
      
      // If no confirmed bookings overlap, the resource is available
      if (confirmedOverlappingBookings.length === 0) {
        availableResources.push(resource);
      }
    }
    
    return availableResources;
  }
}
