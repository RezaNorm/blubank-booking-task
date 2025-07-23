import { FindManyOptions, FindOneOptions } from 'typeorm';
import { Resource } from '../entity/resource.entity';

export const RESOURCE_REPOSITORY = 'RESOURCE_REPOSITORY';

export interface IResourceRepository {
  // Base repository methods
  findById(id: number): Promise<Resource | null>;
  findAll(options?: FindManyOptions<Resource>): Promise<Resource[]>;
  
  // Additional methods
  findOne(options: FindOneOptions<Resource>): Promise<Resource | null>;
}
