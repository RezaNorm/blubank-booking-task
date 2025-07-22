import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityHistory } from '../entity/entity-history.entity';
import { GetEntityHistoryQuery } from './get-entity-history.query';

@QueryHandler(GetEntityHistoryQuery)
export class GetEntityHistoryHandler implements IQueryHandler<GetEntityHistoryQuery> {
  constructor(
    @InjectRepository(EntityHistory)
    private historyRepository: Repository<EntityHistory>,
  ) {}

  async execute(query: GetEntityHistoryQuery): Promise<EntityHistory[]> {
    const { entity, entityId, limit } = query;
    
    const queryBuilder = this.historyRepository
      .createQueryBuilder('history')
      .where('history.entity = :entity', { entity })
      .andWhere('history.entityId = :entityId', { entityId })
      .orderBy('history.createdAt', 'DESC');
    
    if (limit) {
      queryBuilder.take(limit);
    }
    
    return queryBuilder.getMany();
  }
}
