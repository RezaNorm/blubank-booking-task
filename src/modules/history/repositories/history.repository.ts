import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, Between } from 'typeorm';
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
    return this.find({
      where: { entity, entityId },
      order: { timestamp: 'DESC' },
    });
  }

  async findByAction(action: string): Promise<EntityHistory[]> {
    return this.find({
      where: { action },
      order: { timestamp: 'DESC' },
    });
  }

  async findByEntityAndAction(entity: string, action: string): Promise<EntityHistory[]> {
    return this.find({
      where: { entity, action },
      order: { timestamp: 'DESC' },
    });
  }

  async findInTimeRange(startDate: Date, endDate: Date): Promise<EntityHistory[]> {
    return this.find({
      where: {
        timestamp: Between(startDate, endDate),
      },
      order: { timestamp: 'DESC' },
    });
  }

  // Implement the findOne method from the base repository
  async findOne(options: FindOneOptions<EntityHistory>): Promise<EntityHistory | null> {
    return this.historyRepository.findOne({
      ...options,
      relations: [],
    });
  }

  // Implement the update method
  async update(id: number, entity: Partial<EntityHistory>): Promise<EntityHistory | null> {
    await this.historyRepository.update(id, entity);
    return this.findOne({ where: { id } });
  }

  // Implement the delete method
  async delete(id: number): Promise<boolean> {
    const result = await this.historyRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
