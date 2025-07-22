import { Module, forwardRef } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resource } from './entity/resource.entity';
import { ResourceService } from './resource.service';
import { ResourceController } from './resource.controller';
import { BookingModule } from '../booking/booking.module';
import { ResourceRepository } from './repositories/resource.repository';
import { IResourceRepository, RESOURCE_REPOSITORY } from './repositories/resource.repository.interface';
import { Booking } from '../booking/entity/booking.entity';

// Query Handlers
import { FindAvailableResourcesHandler } from './queries/handlers/find-available-resources.handler';

const QueryHandlers = [
  FindAvailableResourcesHandler
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Resource, Booking]),
    forwardRef(() => BookingModule)
  ],
  providers: [
    ResourceService,
    {
      provide: RESOURCE_REPOSITORY,
      useClass: ResourceRepository,
    },
    ...QueryHandlers,
  ],
  controllers: [ResourceController],
  exports: [
    ResourceService,
    {
      provide: RESOURCE_REPOSITORY,
      useClass: ResourceRepository,
    },
    RESOURCE_REPOSITORY,
  ],
})
export class ResourceModule {} 