import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';

export interface IBaseRepository<T> {
  create(entity: DeepPartial<T>): T;
  createMany(entities: DeepPartial<T>[]): T[];
  save(entity: T): Promise<T>;
  saveMany(entities: T[]): Promise<T[]>;
  findOne(options: FindOneOptions<T>): Promise<T | null>;
  findAll(options?: FindManyOptions<T>): Promise<T[]>;
  findById(id: any): Promise<T | null>;
  update(id: any, entity: Partial<T>): Promise<T | null>;
  delete(id: any): Promise<boolean>;
  softDelete(id: any): Promise<boolean>;
  count(options?: FindManyOptions<T>): Promise<number>;
  exists(options: FindManyOptions<T>): Promise<boolean>;
}
