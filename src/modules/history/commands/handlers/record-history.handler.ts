import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityHistory } from '../../entity/entity-history.entity';
import { RecordHistoryCommand } from '../impl/record-history.command';

@CommandHandler(RecordHistoryCommand)
export class RecordHistoryHandler implements ICommandHandler<RecordHistoryCommand> {
  constructor(
    @InjectRepository(EntityHistory)
    private historyRepository: Repository<EntityHistory>,
  ) {}

  async execute(command: RecordHistoryCommand): Promise<void> {
    const { entity, entityId, action, snapshot } = command;
    
    const entry = this.historyRepository.create({
      entity,
      entityId,
      action,
      snapshot,
    });
    
    await this.historyRepository.save(entry);
  }
}
