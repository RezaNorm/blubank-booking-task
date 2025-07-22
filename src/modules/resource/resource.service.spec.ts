import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Resource } from './entity/resource.entity';
import { BookingService } from '../booking/booking.service';
import { ResourceService } from './resource.service';

describe('ResourceService', () => {
  let service: ResourceService;
  let commandBus: jest.Mocked<CommandBus>;
  let queryBus: jest.Mocked<QueryBus>;
  let resourceRepo: any;
  let bookingService: any;

  beforeEach(async () => {
    const mockCommandBus = { execute: jest.fn() };
    const mockQueryBus = { execute: jest.fn() };
    resourceRepo = { find: jest.fn(), findOne: jest.fn() };
    bookingService = { findBookingsForResource: jest.fn(), findAllConfirmed: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResourceService,
        { provide: CommandBus, useValue: mockCommandBus },
        { provide: QueryBus, useValue: mockQueryBus },
        { provide: getRepositoryToken(Resource), useValue: resourceRepo },
        { provide: BookingService, useValue: bookingService },
      ],
    }).compile();

    commandBus = module.get<CommandBus>(CommandBus) as jest.Mocked<CommandBus>;
    queryBus = module.get<QueryBus>(QueryBus) as jest.Mocked<QueryBus>;

    service = module.get<ResourceService>(ResourceService);
  });

  it('should return available resources for a time slot', async () => {
    const mockResources = [{ id: 2, name: 'Meeting Room' }];
    queryBus.execute.mockResolvedValue(mockResources);
    
    const startTime = new Date('2024-07-01T14:00:00.000Z');
    const endTime = new Date('2024-07-01T16:00:00.000Z');
    
    const result = await service.findAvailable(startTime, endTime);
    
    expect(queryBus.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        startTime,
        endTime
      })
    );
    expect(result).toEqual(mockResources);
  });
}); 