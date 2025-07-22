import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './repositories/user.repository';
import { IUserRepository, USER_REPOSITORY } from './repositories/user.repository.interface';

// Query Handlers
import { ListUsersHandler } from './queries/handlers/list-users.handler';

const QueryHandlers = [
  ListUsersHandler,
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([User])
  ],
  providers: [
    UserService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    ...QueryHandlers,
  ],
  controllers: [UserController],
  exports: [
    UserService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    USER_REPOSITORY,
  ],
})
export class UserModule {}