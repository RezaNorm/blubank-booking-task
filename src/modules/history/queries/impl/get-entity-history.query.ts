import { IQuery } from '@nestjs/cqrs';

export class GetEntityHistoryQuery implements IQuery {
  constructor(
    public readonly entity: string,
    public readonly action: string,
    public readonly limit?: number,
  ) {}
}
