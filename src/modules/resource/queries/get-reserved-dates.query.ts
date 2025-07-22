import { IQuery } from '@nestjs/cqrs';

export class GetReservedDatesQuery implements IQuery {
  constructor(
    public readonly resourceId: number,
  ) {}
}
