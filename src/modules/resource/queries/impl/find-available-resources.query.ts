import { IQuery } from '@nestjs/cqrs';

export class FindAvailableResourcesQuery implements IQuery {
  constructor(
    public readonly startTime: Date,
    public readonly endTime: Date,
  ) {}
}
