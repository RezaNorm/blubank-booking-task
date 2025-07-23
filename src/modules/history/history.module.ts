import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityHistory } from './entity/entity-history.entity';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { HistoryRepository } from './repositories/history.repository';
import { HISTORY_REPOSITORY } from './repositories/history.repository.interface';

// Command Handlers
import { RecordHistoryHandler } from './commands/handlers/record-history.handler';

// Query Handlers
import { GetEntityHistoryHandler } from './queries/handler/get-entity-history.handler';

const CommandHandlers = [RecordHistoryHandler];
const QueryHandlers = [GetEntityHistoryHandler];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([EntityHistory])
  ],
  controllers: [HistoryController],
  providers: [
    HistoryService,
    {
      provide: HISTORY_REPOSITORY,
      useClass: HistoryRepository,
    },
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [HistoryService],
})
export class HistoryModule {} 