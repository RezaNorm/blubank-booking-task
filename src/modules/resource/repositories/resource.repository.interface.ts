import { FindManyOptions, FindOneOptions } from 'typeorm';
import { Resource } from '../entity/resource.entity';

export const RESOURCE_REPOSITORY = 'RESOURCE_REPOSITORY';

export interface IResourceRepository {
  // Base repository methods
  save(entity: Partial<Resource>): Promise<Resource>;
  findById(id: number): Promise<Resource | null>;
  find(options?: FindManyOptions<Resource>): Promise<Resource[]>;
  findAll(): Promise<Resource[]>;
  
  // Custom resource repository methods
  findByName(name: string): Promise<Resource | null>;
  
  // Additional methods
  findOne(options: FindOneOptions<Resource>): Promise<Resource | null>;
  update(id: number, entity: Partial<Resource>): Promise<Resource | null>;
  delete(id: number): Promise<boolean>;
}
