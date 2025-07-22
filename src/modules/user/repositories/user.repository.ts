import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { IUserRepository, USER_REPOSITORY } from './user.repository.interface';
import { BaseRepository } from '../../../database/base.repository';

@Injectable()
export class UserRepository
  extends BaseRepository<User>
  implements IUserRepository
{
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async findAll(): Promise<User[]> {
    return this.find();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email } });
  }

  async findByName(name: string): Promise<User[]> {
    return this.find({ 
      where: { name },
      order: { id: 'ASC' },
    });
  }

  async findOne(options: FindOneOptions<User>): Promise<User | null> {
    return this.userRepository.findOne({
      ...options,
      relations: [],
    });
  }

  async update(id: number, entity: Partial<User>): Promise<User | null> {
    await this.userRepository.update(id, entity);
    return this.findOne({ where: { id } });
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
