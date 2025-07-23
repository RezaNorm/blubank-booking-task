import { Injectable } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { IUserRepository } from './user.repository.interface';
import { BaseRepository } from '../../../database/base.repository';

@Injectable()
export class UserRepository
  extends BaseRepository<User>
  implements IUserRepository
{}
