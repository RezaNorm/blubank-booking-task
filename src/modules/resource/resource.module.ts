import { Module, forwardRef } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resource } from './entity/resource.entity';
import { ResourceService } from './resource.service';
import { ResourceController } from './resource.controller';
import { BookingModule } from '../booking/booking.module';

// Command Handlers
import { CreateResourceHandler } from './commands/create-resource.handler';

// Query Handlers
import { FindAvailableResourcesHandler } from './queries/find-available-resources.handler';
import { GetReservedDatesHandler } from './queries/get-reserved-dates.handler';

const CommandHandlers = [CreateResourceHandler];
const QueryHandlers = [
  FindAvailableResourcesHandler,
  GetReservedDatesHandler,
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Resource]), 
    forwardRef(() => BookingModule)
  ],
  providers: [
    ResourceService,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  controllers: [ResourceController],
  exports: [ResourceService],
})
export class ResourceModule {} 