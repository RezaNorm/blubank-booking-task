import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RecordHistoryCommand } from './commands/impl/record-history.command';
import { GetEntityHistoryQuery } from './queries/get-entity-history.query';

@Injectable()
export class HistoryService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * Records a history entry for an entity action
   * @param entity The entity type (e.g., 'booking', 'resource', 'user')
   * @param entityId The ID of the entity
   * @param action The action performed (e.g., 'created', 'updated', 'deleted')
   * @param snapshot The snapshot of the entity state at the time of the action
   */
  async record(entity: string, entityId: number, action: string, snapshot: any): Promise<void> {
    return this.commandBus.execute(
      new RecordHistoryCommand(entity, entityId, action, snapshot)
    );
  }

  /**
   * Retrieves the history of actions for a specific entity
   * @param entity The entity type
   * @param entityId The ID of the entity
   * @param limit Optional limit on the number of history entries to return
   * @returns A promise that resolves to an array of EntityHistory objects
   */
  async getEntityHistory(entity: string, entityId: number, limit?: number) {
    return this.queryBus.execute(
      new GetEntityHistoryQuery(entity, entityId, limit)
    );
  }
} 