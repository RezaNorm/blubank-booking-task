import { Injectable } from '@nestjs/common';
import { Resource } from '../entity/resource.entity';
import { IResourceRepository } from './resource.repository.interface';
import { BaseRepository } from '../../../database/base.repository';

@Injectable()
export class ResourceRepository
  extends BaseRepository<Resource>
  implements IResourceRepository
{}
