import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from './booking.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking } from './entity/booking.entity';
import { UserService } from '../user/user.service';
import { ResourceService } from '../resource/resource.service';
import { IBookingPolicy } from './policy/booking-policy.interface';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('BookingService', () => {
  let service: BookingService;
  let bookingRepo: any;
  let userService: any;
  let resourceService: any;
  let bookingPolicy: any;

  beforeEach(async () => {
    bookingRepo = { save: jest.fn(), findOne: jest.fn(), find: jest.fn() };
    userService = { findOne: jest.fn() };
    resourceService = { findOne: jest.fn() };
    bookingPolicy = { canCreateBooking: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        { provide: getRepositoryToken(Booking), useValue: bookingRepo },
        { provide: UserService, useValue: userService },
        { provide: ResourceService, useValue: resourceService },
        { provide: 'IBookingPolicy', useValue: bookingPolicy },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
    service.findBookingsForResource = jest.fn().mockResolvedValue([]); // Always mock to return []
  });

  it('should create a booking if allowed', async () => {
    userService.findOne.mockResolvedValue({ id: 1 });
    resourceService.findOne.mockResolvedValue({ id: 1 });
    bookingPolicy.canCreateBooking.mockReturnValue({ allowed: true });
    bookingRepo.save.mockResolvedValue({ id: 1 });

    const result = await service.create({
      userId: 1,
      resourceId: 1,
      startTime: '2024-07-01T14:00:00.000Z',
      endTime: '2024-07-01T16:00:00.000Z',
    });

    expect(result).toEqual({ id: 1 });
    expect(bookingRepo.save).toHaveBeenCalled();
  });

  it('should throw if user not found', async () => {
    resourceService.findOne.mockResolvedValue({ id: 1 }); // Ensure resource is found
    userService.findOne.mockResolvedValue(null);
    await expect(
      service.create({
        userId: 1,
        resourceId: 1,
        startTime: '2024-07-01T14:00:00.000Z',
        endTime: '2024-07-01T16:00:00.000Z',
      }),
    ).rejects.toThrow('User not found');
  });

  it('should throw if resource not found', async () => {
    userService.findOne.mockResolvedValue({ id: 1 });
    resourceService.findOne.mockResolvedValue(null);
    await expect(
      service.create({
        userId: 1,
        resourceId: 1,
        startTime: '2024-07-01T14:00:00.000Z',
        endTime: '2024-07-01T16:00:00.000Z',
      }),
    ).rejects.toThrow('Resource not found');
  });

  it('should throw if booking policy disallows', async () => {
    userService.findOne.mockResolvedValue({ id: 1 });
    resourceService.findOne.mockResolvedValue({ id: 1 });
    bookingPolicy.canCreateBooking.mockReturnValue({ allowed: false, reason: 'Overlap' });
    service.findBookingsForResource = jest.fn().mockResolvedValue([]); // Ensure it's mocked

    await expect(
      service.create({
        userId: 1,
        resourceId: 1,
        startTime: '2024-07-01T14:00:00.000Z',
        endTime: '2024-07-01T16:00:00.000Z',
      }),
    ).rejects.toThrow('Overlap');
  });

  it('should confirm a booking if allowed', async () => {
    const booking = { id: 1, status: 'pending', resource: { id: 1 }, startTime: new Date(), endTime: new Date() };
    bookingRepo.findOne.mockResolvedValue(booking);
    resourceService.findOne.mockResolvedValue({ id: 1 });
    service.findBookingsForResource = jest.fn().mockResolvedValue([]);
    bookingPolicy.canCreateBooking.mockReturnValue({ allowed: true });
    bookingRepo.save.mockResolvedValue({ ...booking, status: 'confirmed' });

    const result = await service.confirm(1);
    expect(result.status).toBe('confirmed');
    expect(bookingRepo.save).toHaveBeenCalled();
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

  it('should cancel a booking', async () => {
    const booking = { id: 1, status: 'pending' };
    bookingRepo.findOne.mockResolvedValue(booking);
    bookingRepo.save.mockResolvedValue({ ...booking, status: 'cancelled' });
    const result = await service.cancel(1);
    expect(result.status).toBe('cancelled');
    expect(bookingRepo.save).toHaveBeenCalled();
  });

  it('should throw if booking not found on cancel', async () => {
    bookingRepo.findOne.mockResolvedValue(null);
    await expect(service.cancel(1)).rejects.toThrow('Booking not found');
  });
}); 