import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource } from './entity/resource.entity';
import { BookingService } from '../booking/booking.service';
import { FindAvailableResourcesQuery } from './queries/find-available-resources.query';
import { GetReservedDatesQuery } from './queries/get-reserved-dates.query';


@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(Resource)
    private resourceRepo: Repository<Resource>,
    @Inject(forwardRef(() => BookingService))
    private bookingService: BookingService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async findOne(id: number): Promise<Resource | null> {
    return this.resourceRepo.findOne({ where: { id } });
  }

  async findAvailable(startTime: Date, endTime: Date) {
    return this.queryBus.execute(
      new FindAvailableResourcesQuery(startTime, endTime)
    );
  }

  async getReservedDates(resourceId: number) {
    return this.queryBus.execute(
      new GetReservedDatesQuery(resourceId)
    );
  }
}
