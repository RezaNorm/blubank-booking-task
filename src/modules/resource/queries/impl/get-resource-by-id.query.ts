import { IQuery } from '@nestjs/cqrs';

export class GetResourceByIdQuery implements IQuery {
  constructor(public readonly id: number) {}
}
