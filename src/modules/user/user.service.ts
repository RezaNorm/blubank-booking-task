import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserCommand } from './commands/create-user.command';
import { GetAllUsersQuery } from './queries/get-all-users.query';
import { GetUserByIdQuery } from './queries/get-user-by-id.query';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  create(userData: CreateUserDto) {
    return this.commandBus.execute(
      new CreateUserCommand(userData)
    );
  }

  async findOne(id: number): Promise<User | null> {
    return this.queryBus.execute(
      new GetUserByIdQuery(id)
    );
  }

  async findAll(): Promise<User[]> {
    return this.queryBus.execute(
      new GetAllUsersQuery()
    );
  }
} 