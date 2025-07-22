import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Resource } from './entity/resource.entity';

// Queries
import { FindAvailableResourcesQuery } from './queries/impl/find-available-resources.query';

@Injectable()
export class ResourceService {
  constructor(
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * Find available resources within a time range
   * @param startTime Start time
   * @param endTime End time
   * @returns Promise with array of available resources
   */
  async findAvailable(startTime: Date, endTime: Date): Promise<Resource[]> {
    return this.queryBus.execute(
      new FindAvailableResourcesQuery(startTime, endTime)
    );
  }
}
