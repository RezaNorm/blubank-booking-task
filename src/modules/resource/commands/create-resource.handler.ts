import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource } from '../entity/resource.entity';
import { CreateResourceCommand } from './create-resource.command';

@CommandHandler(CreateResourceCommand)
export class CreateResourceHandler implements ICommandHandler<CreateResourceCommand> {
  constructor(
    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>,
  ) {}

  async execute(command: CreateResourceCommand): Promise<Resource> {
    const { name, description } = command;
    
    const resource = this.resourceRepository.create({
      name,
      description,
    });

    return this.resourceRepository.save(resource);
  }
}
