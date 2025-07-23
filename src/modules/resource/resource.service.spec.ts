import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Resource } from './entity/resource.entity';
import { Booking, BookingStatus } from '../booking/entity/booking.entity';

// Mock User interface since we don't want to depend on the actual User entity
interface MockUser {
  id: number;
  email: string;
  name: string;
}
import { BookingService } from '../booking/booking.service';
import { ResourceService } from './resource.service';
import { IResourceRepository, RESOURCE_REPOSITORY } from './repositories/resource.repository.interface';

describe('ResourceService', () => {
  let service: ResourceService;
  let commandBus: jest.Mocked<CommandBus>;
  let queryBus: jest.Mocked<QueryBus>;
  let resourceRepository: jest.Mocked<IResourceRepository>;
  let bookingService: jest.Mocked<BookingService>;

  beforeEach(async () => {
    const mockCommandBus = { execute: jest.fn() };
    const mockQueryBus = { execute: jest.fn() };
    
    const mockResourceRepository = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const mockBookingService = {
      getBookingsInTimeRange: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResourceService,
        { provide: CommandBus, useValue: mockCommandBus },
        { provide: QueryBus, useValue: mockQueryBus },
        {
          provide: RESOURCE_REPOSITORY,
          useValue: mockResourceRepository,
        },
        { provide: BookingService, useValue: mockBookingService },
      ],
    }).compile();

    commandBus = module.get<CommandBus>(CommandBus) as jest.Mocked<CommandBus>;
    queryBus = module.get<QueryBus>(QueryBus) as jest.Mocked<QueryBus>;
    resourceRepository = module.get<IResourceRepository>(RESOURCE_REPOSITORY) as jest.Mocked<IResourceRepository>;
    bookingService = module.get<BookingService>(BookingService) as jest.Mocked<BookingService>;

    service = module.get<ResourceService>(ResourceService);
  });

  describe('findAvailable', () => {
    it('should return available resources for a time slot', async () => {
      const mockAvailableResources = [
      { id: 2, name: 'Meeting Room B' }
    ];
    
    const startTime = new Date('2024-07-01T14:00:00.000Z');
    const endTime = new Date('2024-07-01T16:00:00.000Z');
    
    // Mock the query bus to return the available resources
    (queryBus.execute as jest.Mock).mockResolvedValue(mockAvailableResources);
    
    const result = await service.findAvailable(startTime, endTime);
    
    // Verify queryBus.execute was called with the correct query
    expect(queryBus.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        startTime,
        endTime,
      })
    );
    expect(result).toEqual(mockAvailableResources);
    });
  });

  describe('getReservedDates', () => {
    it('should return reserved dates for a resource within a date range', async () => {
      const resourceId = 1;
      const startDate = new Date('2024-07-01T00:00:00.000Z');
      const endDate = new Date('2024-07-07T23:59:59.999Z');
      
      const mockReservedDates = [
        new Date('2024-07-01T00:00:00.000Z'),
        new Date('2024-07-02T00:00:00.000Z'),
        new Date('2024-07-03T00:00:00.000Z'),
        new Date('2024-07-05T00:00:00.000Z')
      ];
      
      // Mock the query bus to return the reserved dates
      (queryBus.execute as jest.Mock).mockResolvedValue(mockReservedDates);
      
      const result = await service.getReservedDates(resourceId, startDate, endDate);
      
      // Verify queryBus.execute was called with the correct query
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          resourceId,
          startDate,
          endDate,
        })
      );
      
      // Verify the result
      expect(result).toHaveLength(4);
      expect(result[0].toISOString().split('T')[0]).toBe('2024-07-01');
      expect(result[1].toISOString().split('T')[0]).toBe('2024-07-02');
      expect(result[2].toISOString().split('T')[0]).toBe('2024-07-03');
      expect(result[3].toISOString().split('T')[0]).toBe('2024-07-05');
    });
  });
}); 