import { FindManyOptions, FindOneOptions } from 'typeorm';
import { User } from '../entity/user.entity';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface IUserRepository {
  // Base repository methods
  save(entity: Partial<User>): Promise<User>;
  findById(id: number): Promise<User | null>;
  findAll(): Promise<User[]>;
  
  // Additional methods
  findOne(options: FindOneOptions<User>): Promise<User | null>;
}
