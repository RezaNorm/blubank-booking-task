import { IQuery } from '@nestjs/cqrs';

export class ListUsersQuery implements IQuery {
  // No parameters needed for listing all users
  constructor() {}
}
