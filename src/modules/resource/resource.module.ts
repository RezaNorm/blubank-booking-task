import { Module, forwardRef } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resource } from './entity/resource.entity';
import { ResourceService } from './resource.service';
import { ResourceController } from './resource.controller';
import { BookingModule } from '../booking/booking.module';
import { ResourceRepository } from './repositories/resource.repository';
import { IResourceRepository, RESOURCE_REPOSITORY } from './repositories/resource.repository.interface';

// Query Handlers
import { FindAvailableResourcesHandler } from './queries/handlers/find-available-resources.handler';
import { GetResourceByIdHandler } from './queries/handlers/get-resource-by-id.handler';

const QueryHandlers = [
  FindAvailableResourcesHandler,
  GetResourceByIdHandler
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Resource]),
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
    ResourceService
  ],
})
export class ResourceModule {} 