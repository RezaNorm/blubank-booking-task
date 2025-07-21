import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityHistory } from './entity/entity-history.entity';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(EntityHistory)
    private historyRepo: Repository<EntityHistory>,
  ) {}

  async record(entity: string, entityId: number, action: string, snapshot: any) {
    const entry = this.historyRepo.create({
      entity,
      entityId,
      action,
      snapshot,
    });
    await this.historyRepo.save(entry);
  }
} 