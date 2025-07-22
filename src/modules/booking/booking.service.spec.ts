import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking } from './entity/booking.entity';
import { UserService } from '../user/user.service';
import { ResourceService } from '../resource/resource.service';
import { BookingService } from './booking.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { GetAllBookingsQuery } from './queries/get-all-bookings.query';

describe('BookingService', () => {
  let service: BookingService;
  let commandBus: jest.Mocked<CommandBus>;
  let queryBus: jest.Mocked<QueryBus>;
  let bookingRepo: any;
  let userService: any;
  let resourceService: any;

  beforeEach(async () => {
    const mockCommandBus = { execute: jest.fn() };
    const mockQueryBus = { execute: jest.fn() };
    bookingRepo = { save: jest.fn(), findOne: jest.fn(), find: jest.fn() };
    userService = { findOne: jest.fn() };
    resourceService = { findOne: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        { provide: CommandBus, useValue: mockCommandBus },
        { provide: QueryBus, useValue: mockQueryBus },
        { provide: getRepositoryToken(Booking), useValue: bookingRepo },
        { provide: UserService, useValue: userService },
        { provide: ResourceService, useValue: resourceService },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
    commandBus = module.get<CommandBus>(CommandBus) as jest.Mocked<CommandBus>;
    queryBus = module.get<QueryBus>(QueryBus) as jest.Mocked<QueryBus>;
    service.findBookingsForResource = jest.fn().mockResolvedValue([]);
  });

  it('should create a booking', async () => {
    const mockBooking = { id: 1, userId: 1, resourceId: 1 };
    const createDto = {
      userId: 1,
      resourceId: 1,
      startTime: '2024-07-01T14:00:00.000Z',
      endTime: '2024-07-01T16:00:00.000Z',
    };

    commandBus.execute.mockResolvedValue(mockBooking);

    const result = await service.createBooking(createDto);

    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: createDto.userId,
        resourceId: createDto.resourceId,
        startTime: createDto.startTime,
        endTime: createDto.endTime,
      })
    );
    expect(result).toEqual(mockBooking);
  });

  it('should get booking by id', async () => {
    const mockBooking = { id: 1, userId: 1, resourceId: 1 };
    queryBus.execute.mockResolvedValue(mockBooking);

    const result = await service.getBookingById(1);

    expect(queryBus.execute).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1 })
    );
    expect(result).toEqual(mockBooking);
  });

  it('should confirm a booking', async () => {
    const mockBooking = { id: 1, status: 'confirmed' };
    commandBus.execute.mockResolvedValue(mockBooking);

    const result = await service.confirmBooking(1);

    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1 })
    );
    expect(result).toEqual(mockBooking);
  });

  it('should cancel a booking', async () => {
    const mockBooking = { id: 1, status: 'cancelled' };
    commandBus.execute.mockResolvedValue(mockBooking);

    const result = await service.cancelBooking(1);

    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1 })
    );
    expect(result).toEqual(mockBooking);
  });

  it('should get all bookings', async () => {
    const mockBookings = [
      { id: 1, userId: 1, resourceId: 1 },
      { id: 2, userId: 1, resourceId: 2 },
    ];
    queryBus.execute.mockResolvedValue(mockBookings);

    const result = await service.getAllBookings();

    expect(queryBus.execute).toHaveBeenCalledWith(expect.any(GetAllBookingsQuery));
    expect(result).toEqual(mockBookings);
  });

  it('should get bookings by user id', async () => {
    const mockBookings = [
      { id: 1, userId: 1, resourceId: 1 },
      { id: 2, userId: 1, resourceId: 2 },
    ];
    queryBus.execute.mockResolvedValue(mockBookings);

    const result = await service.getAllBookings(1);

    expect(queryBus.execute).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 1 })
    );
    expect(result).toEqual(mockBookings);
  });

  it('should get bookings by resource id', async () => {
    const mockBookings = [
      { id: 1, userId: 1, resourceId: 1 },
      { id: 2, userId: 2, resourceId: 1 },
    ];
    queryBus.execute.mockResolvedValue(mockBookings);

    const result = await service.getAllBookings(undefined, 1);

    expect(queryBus.execute).toHaveBeenCalledWith(
      expect.objectContaining({ resourceId: 1 })
    );
    expect(result).toEqual(mockBookings);
  });

  it('should handle errors when getting booking by id', async () => {
    queryBus.execute.mockRejectedValue(new NotFoundException('Booking not found'));
    await expect(service.getBookingById(999)).rejects.toThrow('Booking not found');
  });

  it('should handle errors when confirming booking', async () => {
    commandBus.execute.mockRejectedValue(new BadRequestException('Booking already confirmed'));
    await expect(service.confirmBooking(1)).rejects.toThrow('Booking already confirmed');
  });

  it('should handle errors when cancelling booking', async () => {
    commandBus.execute.mockRejectedValue(new BadRequestException('Cannot cancel booking'));
    await expect(service.cancelBooking(1)).rejects.toThrow('Cannot cancel booking');
  });

  it('should throw if booking is not pending on confirm', async () => {
    const booking = { id: 1, status: 'confirmed', resource: { id: 1 }, startTime: new Date(), endTime: new Date() };
    bookingRepo.findOne.mockResolvedValue(booking);
    await expect(service.confirm(1)).rejects.toThrow('Booking cannot be confirmed');
  });

  it('should throw if booking not found on confirm', async () => {
    bookingRepo.findOne.mockResolvedValue(null);
    await expect(service.confirm(1)).rejects.toThrow('Booking not found');
  });

  it('should throw if booking not found on cancel', async () => {
    bookingRepo.findOne.mockResolvedValue(null);
    await expect(service.cancel(1)).rejects.toThrow('Booking not found');
  });
});