import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { User } from './entity/user.entity';

// Queries
import { ListUsersQuery } from './queries/impl/list-users.query';
import { GetUserByIdQuery } from './queries/impl/get-user-by-id.query';

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

  /**
   * Find a user by ID
   * @param id The ID of the user to find
   * @returns The found user
   * @throws NotFoundException if user is not found
   */
  async findById(id: number): Promise<User> {
    const user = await this.queryBus.execute(new GetUserByIdQuery(id));
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
} 