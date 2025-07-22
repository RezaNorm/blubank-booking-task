import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ListUsersQuery } from '../impl/list-users.query';
import { IUserRepository, USER_REPOSITORY } from '../../repositories/user.repository.interface';

@QueryHandler(ListUsersQuery)
export class ListUsersHandler implements IQueryHandler<ListUsersQuery> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: ListUsersQuery) {
    return this.userRepository.findAll();
  }
}
