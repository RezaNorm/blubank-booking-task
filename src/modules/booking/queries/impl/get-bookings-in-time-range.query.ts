import { IQuery } from '@nestjs/cqrs';

export class GetBookingsInTimeRangeQuery implements IQuery {
  constructor(
    public readonly startTime: Date,
    public readonly endTime: Date,
    public readonly resourceId?: number
  ) {}
}
