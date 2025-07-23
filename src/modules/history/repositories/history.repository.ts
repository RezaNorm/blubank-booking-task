import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { EntityHistory } from '../entity/entity-history.entity';
import { IHistoryRepository } from './history.repository.interface';
import { BaseRepository } from '../../../database/base.repository';

@Injectable()
export class HistoryRepository
  extends BaseRepository<EntityHistory>
  implements IHistoryRepository
{
  constructor(
    @InjectRepository(EntityHistory)
    private readonly historyRepository: Repository<EntityHistory>,
  ) {
    super(historyRepository);
  }

  async findByEntity(entity: string, entityId: number): Promise<EntityHistory[]> {
    return this.findAll({
      where: { entity, entityId },
      order: { timestamp: 'DESC' },
    });
  }

  async findByAction(action: string): Promise<EntityHistory[]> {
    return this.findAll({
      where: { action },
      order: { timestamp: 'DESC' },
    });
  }

  async findByEntityAndAction(entity: string, action: string): Promise<EntityHistory[]> {
    return this.findAll({
      where: { entity, action },
      order: { timestamp: 'DESC' },
    });
  }

  async findInTimeRange(startDate: Date, endDate: Date): Promise<EntityHistory[]> {
    return this.findAll({
      where: {
        timestamp: Between(startDate, endDate),
      },
      order: { timestamp: 'DESC' },
    });
  }

}
