import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityHistory } from '../../entity/entity-history.entity';
import { GetEntityHistoryQuery } from '../impl/get-entity-history.query';

@QueryHandler(GetEntityHistoryQuery)
export class GetEntityHistoryHandler implements IQueryHandler<GetEntityHistoryQuery> {
  constructor(
    @InjectRepository(EntityHistory)
    private historyRepository: Repository<EntityHistory>,
  ) {}

  async execute(query: GetEntityHistoryQuery): Promise<EntityHistory[]> {
    const { entity, action, limit } = query;
    
    const queryBuilder = this.historyRepository
      .createQueryBuilder('history')
      .where('history.entity = :entity', { entity })
      .andWhere('history.action = :action', { action })
      .orderBy('history.timestamp', 'DESC');
    
    if (limit) {
      queryBuilder.take(limit);
    }
    
    return queryBuilder.getMany();
  }
}
