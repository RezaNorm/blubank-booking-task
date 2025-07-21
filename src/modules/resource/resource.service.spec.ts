import { Test, TestingModule } from '@nestjs/testing';
import { ResourceService } from './resource.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Resource } from './entity/resource.entity';
import { BookingService } from '../booking/booking.service';

describe('ResourceService', () => {
  let service: ResourceService;
  let resourceRepo: any;
  let bookingService: any;

  beforeEach(async () => {
    resourceRepo = { find: jest.fn(), findOne: jest.fn() };
    bookingService = { findBookingsForResource: jest.fn(), findAllConfirmed: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResourceService,
        { provide: getRepositoryToken(Resource), useValue: resourceRepo },
        { provide: BookingService, useValue: bookingService },
      ],
    }).compile();

    service = module.get<ResourceService>(ResourceService);
  });

  it('should return null if resource not found', async () => {
    resourceRepo.findOne.mockResolvedValue(null);
    const result = await service.findOne(1);
    expect(result).toBeNull();
  });

  it('should return available resources for a time slot', async () => {
    resourceRepo.find.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    bookingService.findAllConfirmed.mockResolvedValue([
      { resource: { id: 1 }, startTime: new Date('2024-07-01T14:00:00.000Z'), endTime: new Date('2024-07-01T16:00:00.000Z'), status: 'confirmed' },
    ]);
    const result = await service.findAvailable(new Date('2024-07-01T14:00:00.000Z'), new Date('2024-07-01T16:00:00.000Z'));
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(2);
  });

  it('should return reserved dates for a resource', async () => {
    bookingService.findBookingsForResource.mockResolvedValue([
      { startTime: new Date('2024-07-01T14:00:00.000Z'), endTime: new Date('2024-07-01T16:00:00.000Z'), id: 1 },
    ]);
    const result = await service.getReservedDates(1);
    expect(result.length).toBe(1);
    expect(result[0]).toHaveProperty('start');
    expect(result[0]).toHaveProperty('end');
  });
}); 