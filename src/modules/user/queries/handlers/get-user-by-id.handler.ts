import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserByIdQuery } from '../impl/get-user-by-id.query';
import { Inject } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '../../repositories/user.repository.interface';
import { User } from '../../entity/user.entity';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetUserByIdQuery): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: query.id } });
  }
}
