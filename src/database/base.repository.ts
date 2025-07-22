import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository, ObjectLiteral } from 'typeorm';
import { IBaseRepository } from './base.repository.interface';

export abstract class BaseRepository<T extends ObjectLiteral> implements IBaseRepository<T> {
  constructor(private readonly repository: Repository<T>) {}

  create(entity: DeepPartial<T>): T {
    return this.repository.create(entity);
  }

  createMany(entities: DeepPartial<T>[]): T[] {
    return this.repository.create(entities);
  }

  async save(entity: T): Promise<T> {
    return this.repository.save(entity as any);
  }

  async saveMany(entities: T[]): Promise<T[]> {
    return this.repository.save(entities as any[]);
  }

  async findOne(options: FindOneOptions<T>): Promise<T | null> {
    return this.repository.findOne(options);
  }

  async find(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async findById(id: any): Promise<T | null> {
    return this.repository.findOne({ where: { id } as any });
  }

  async update(id: any, entity: Partial<T>): Promise<T | null> {
    const existing = await this.findById(id);
    if (!existing) {
      return null;
    }
    Object.assign(existing, entity);
    return this.save(existing as any);
  }

  async delete(id: any): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async softDelete(id: any): Promise<boolean> {
    const result = await this.repository.softDelete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async count(options?: FindManyOptions<T>): Promise<number> {
    return this.repository.count(options);
  }

  async exists(options: FindManyOptions<T>): Promise<boolean> {
    const count = await this.count(options);
    return count > 0;
  }
}
