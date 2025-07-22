import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityHistory } from './entity/entity-history.entity';
import { HistoryService } from './history.service';

// Command Handlers
import { RecordHistoryHandler } from './commands/record-history.handler';

// Query Handlers
import { GetEntityHistoryHandler } from './queries/get-entity-history.handler';

const CommandHandlers = [RecordHistoryHandler];
const QueryHandlers = [GetEntityHistoryHandler];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([EntityHistory])
  ],
  providers: [
    HistoryService,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [TypeOrmModule, HistoryService],
})
export class HistoryModule {} 