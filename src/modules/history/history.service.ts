import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityHistory } from './entity/entity-history.entity';
import { RecordHistoryCommand } from './commands/record-history.command';
import { GetEntityHistoryQuery } from './queries/get-entity-history.query';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(EntityHistory)
    private historyRepo: Repository<EntityHistory>,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async record(entity: string, entityId: number, action: string, snapshot: any) {
    return this.commandBus.execute(
      new RecordHistoryCommand(entity, entityId, action, snapshot)
    );
  }

  async getEntityHistory(entity: string, entityId: number, limit?: number) {
    return this.queryBus.execute(
      new GetEntityHistoryQuery(entity, entityId, limit)
    );
  }
} 