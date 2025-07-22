import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

// Queries
import { ListUsersQuery } from './queries/impl/list-users.query';

@Injectable()
export class UserService {
  constructor(
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * Find all users
   * @returns Promise with array of all users
   */
  async findAll(): Promise<User[]> {
    return this.queryBus.execute(new ListUsersQuery());
  }
} 