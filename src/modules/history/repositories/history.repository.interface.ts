import { FindManyOptions, FindOneOptions } from 'typeorm';
import { EntityHistory } from '../entity/entity-history.entity';

export const HISTORY_REPOSITORY = 'HISTORY_REPOSITORY';

export interface IHistoryRepository {
  // Base repository methods
  save(entity: Partial<EntityHistory>): Promise<EntityHistory>;
  findAll(options?: FindManyOptions<EntityHistory>): Promise<EntityHistory[]>;
  
  // Custom history repository methods
  findByEntity(entity: string, entityId: number): Promise<EntityHistory[]>;
  findByAction(action: string): Promise<EntityHistory[]>;
  findByEntityAndAction(entity: string, action: string): Promise<EntityHistory[]>;
  
  // Additional methods
  findOne(options: FindOneOptions<EntityHistory>): Promise<EntityHistory | null>;
}
