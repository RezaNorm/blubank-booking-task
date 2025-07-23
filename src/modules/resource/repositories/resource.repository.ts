import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Resource } from '../entity/resource.entity';
import { IResourceRepository, RESOURCE_REPOSITORY } from './resource.repository.interface';
import { BaseRepository } from '../../../database/base.repository';

@Injectable()
export class ResourceRepository
  extends BaseRepository<Resource>
  implements IResourceRepository
{
  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
  ) {
    super(resourceRepository);
  }

  async findAll(): Promise<Resource[]> {
    return this.find();
  }

  async findByName(name: string): Promise<Resource | null> {
    return this.findOne({ where: { name } });
  }

  async findOne(options: FindOneOptions<Resource>): Promise<Resource | null> {
    return this.resourceRepository.findOne({
      ...options,
      relations: [],
    });
  }

  async update(id: number, entity: Partial<Resource>): Promise<Resource | null> {
    await this.resourceRepository.update(id, entity);
    return this.findOne({ where: { id } });
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.resourceRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
