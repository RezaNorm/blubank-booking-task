import { ICommand } from '@nestjs/cqrs';

export class CreateResourceCommand implements ICommand {
  constructor(
    public readonly name: string,
    public readonly description?: string,
  ) {}
}
