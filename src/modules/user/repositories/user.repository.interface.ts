import { FindManyOptions, FindOneOptions } from 'typeorm';
import { User } from '../entity/user.entity';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface IUserRepository {
  // Base repository methods
  save(entity: Partial<User>): Promise<User>;
  findById(id: number): Promise<User | null>;
  find(options?: FindManyOptions<User>): Promise<User[]>;
  findAll(): Promise<User[]>;
  
  // Custom user repository methods
  findByEmail(email: string): Promise<User | null>;
  findByName(name: string): Promise<User[]>;
  
  // Additional methods
  findOne(options: FindOneOptions<User>): Promise<User | null>;
  update(id: number, entity: Partial<User>): Promise<User | null>;
  delete(id: number): Promise<boolean>;
}
