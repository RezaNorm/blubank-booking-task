import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource } from '../entity/resource.entity';
import { IResourceRepository } from './resource.repository.interface';
import { BaseRepository } from '../../../database/base.repository';

@Injectable()
export class ResourceRepository
  extends BaseRepository<Resource>
  implements IResourceRepository
{
  constructor(
    @InjectRepository(Resource)
    repository: Repository<Resource>,
  ) {
    super(repository);
  }
}
