import { Inject, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Resource } from './entity/resource.entity';
import { IResourceRepository, RESOURCE_REPOSITORY } from './repositories/resource.repository.interface';

// Queries
import { FindAvailableResourcesQuery } from './queries/impl/find-available-resources.query';
import { GetReservedDatesQuery } from './queries/impl/get-reserved-dates.query';
import { GetResourceByIdQuery } from './queries/impl/get-resource-by-id.query';

@Injectable()
export class ResourceService {
  constructor(
    private readonly queryBus: QueryBus
  ) {}

  /**
   * Find available resources within a time range
   * @param startTime Start time
   * @param endTime End time
   * @returns Promise with array of available resources
   */
  /**
   * Find available resources within a time range using CQRS query
   * @param startTime Start time
   * @param endTime End time
   * @returns Promise with array of available resources
   */
  async findAvailable(startTime: Date, endTime: Date): Promise<Resource[]> {
    return this.queryBus.execute(
      new FindAvailableResourcesQuery(startTime, endTime)
    );
  }

  /**
   * Get all reserved dates for a resource within a date range using CQRS query
   * @param resourceId The ID of the resource
   * @param startDate Start of the date range
   * @param endDate End of the date range
   * @returns Array of reserved dates
   */
  async getReservedDates(resourceId: number, startDate: Date, endDate: Date): Promise<Date[]> {
    return this.queryBus.execute(
      new GetReservedDatesQuery(resourceId, startDate, endDate)
    );
  }

  /**
   * Find a resource by its ID using CQRS query
   * @param id The ID of the resource to find
   * @returns The found resource or null if not found
   */
  async findById(id: number): Promise<Resource | null> {
    return this.queryBus.execute(new GetResourceByIdQuery(id));
  }
}
