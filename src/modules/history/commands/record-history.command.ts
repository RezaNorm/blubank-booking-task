import { ICommand } from '@nestjs/cqrs';

export class RecordHistoryCommand implements ICommand {
  constructor(
    public readonly entity: string,
    public readonly entityId: number,
    public readonly action: string,
    public readonly snapshot: any,
  ) {}
}
