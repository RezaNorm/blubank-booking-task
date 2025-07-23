import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetResourceByIdQuery } from '../impl/get-resource-by-id.query';
import { Inject } from '@nestjs/common';
import { IResourceRepository, RESOURCE_REPOSITORY } from '../../repositories/resource.repository.interface';
import { Resource } from '../../entity/resource.entity';

@QueryHandler(GetResourceByIdQuery)
export class GetResourceByIdHandler implements IQueryHandler<GetResourceByIdQuery> {
  constructor(
    @Inject(RESOURCE_REPOSITORY)
    private readonly resourceRepository: IResourceRepository,
  ) {}

  async execute(query: GetResourceByIdQuery): Promise<Resource | null> {
    return this.resourceRepository.findOne({ where: { id: query.id } });
  }
}
