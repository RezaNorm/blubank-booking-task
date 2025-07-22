import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

// Command Handlers
import { CreateUserHandler } from './commands/create-user.handler';

// Query Handlers
import { GetAllUsersHandler } from './queries/get-all-users.handler';
import { GetUserByIdHandler } from './queries/get-user-by-id.handler';

const CommandHandlers = [CreateUserHandler];
const QueryHandlers = [
  GetAllUsersHandler,
  GetUserByIdHandler,
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([User])
  ],
  providers: [
    UserService,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {} 