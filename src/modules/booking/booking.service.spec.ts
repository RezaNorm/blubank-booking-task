import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { BookingService } from './booking.service';
import { BadRequestException } from '@nestjs/common';
import { Booking } from './entity/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

// Commands
import { CreateBookingCommand } from './commands/impl/create-booking.command';
import { ConfirmBookingCommand } from './commands/impl/confirm-booking.command';
import { CancelBookingCommand } from './commands/impl/cancel-booking.command';

// Queries
import { GetBookingByIdQuery } from './queries/impl/get-booking-by-id.query';
import { GetBookingsByUserQuery } from './queries/impl/get-bookings-by-user.query';
import { GetBookingsByResourceQuery } from './queries/impl/get-bookings-by-resource.query';
import { GetAllBookingsQuery } from './queries/impl/get-all-bookings.query';

describe('BookingService', () => {
  let service: BookingService;
  let commandBus: jest.Mocked<CommandBus>;
  let queryBus: jest.Mocked<QueryBus>;

  beforeEach(async () => {
    const mockCommandBus = { execute: jest.fn() };
    const mockQueryBus = { execute: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        { provide: CommandBus, useValue: mockCommandBus },
        { provide: QueryBus, useValue: mockQueryBus },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
    commandBus = module.get<CommandBus>(CommandBus) as jest.Mocked<CommandBus>;
    queryBus = module.get<QueryBus>(QueryBus) as jest.Mocked<QueryBus>;
  });

  it('should create a booking', async () => {
    const mockUser = { id: 1 } as any;
    const mockResource = { id: 1 } as any;
    const startTime = '2024-07-01T14:00:00.000Z';
    const endTime = '2024-07-01T16:00:00.000Z';
    
    const mockBooking: Booking = {
      id: 1,
      user: mockUser,
      resource: mockResource,
      status: 'pending',
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Booking;

    const createDto: CreateBookingDto = {
      userId: 1,
      resourceId: 1,
      startTime,
      endTime,
    };

    commandBus.execute.mockResolvedValue(mockBooking);

    const result = await service.createBooking(createDto);
    
    expect(result).toEqual(mockBooking);
    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.any(CreateBookingCommand)
    );
    
    const command = commandBus.execute.mock.calls[0][0] as CreateBookingCommand;
    expect(command).toBeInstanceOf(CreateBookingCommand);
    expect(command.userId).toBe(createDto.userId);
    expect(command.resourceId).toBe(createDto.resourceId);
    expect(command.startTime).toBe(createDto.startTime);
    expect(command.endTime).toBe(createDto.endTime);
  });

  it('should find bookings by user', async () => {
    const mockUser = { id: 1 } as any;
    const mockBookings = [
      { id: 1, user: mockUser } as Booking,
      { id: 2, user: mockUser } as Booking,
    ];
    
    queryBus.execute.mockResolvedValue(mockBookings);

    const result = await service.getAllBookings(1);
    expect(result).toEqual(mockBookings);
    expect(queryBus.execute).toHaveBeenCalledWith(expect.any(GetBookingsByUserQuery));
    
    const query = queryBus.execute.mock.calls[0][0] as GetBookingsByUserQuery;
    expect(query).toBeInstanceOf(GetBookingsByUserQuery);
    expect(query.userId).toBe(1);
  });

  it('should find all bookings', async () => {
    const mockBookings = [
      { id: 1 } as Booking,
      { id: 2 } as Booking,
    ];
    
    queryBus.execute.mockResolvedValue(mockBookings);

    const result = await service.getAllBookings();
    expect(result).toEqual(mockBookings);
    expect(queryBus.execute).toHaveBeenCalledWith(expect.any(GetAllBookingsQuery));
  });

  it('should get a booking by ID', async () => {
    const mockBooking = { id: 1 } as Booking;
    queryBus.execute.mockResolvedValue(mockBooking);

    const result = await service.getBookingById(1);
    expect(result).toEqual(mockBooking);
    expect(queryBus.execute).toHaveBeenCalledWith(expect.any(GetBookingByIdQuery));
    
    const query = queryBus.execute.mock.calls[0][0] as GetBookingByIdQuery;
    expect(query).toBeInstanceOf(GetBookingByIdQuery);
    expect(query.id).toBe(1);
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
    queryBus.execute.mockRejectedValue(new Error('Booking not found'));
    await expect(service.getBookingById(999)).rejects.toThrow('Booking not found');
  });

  it('should confirm a booking', async () => {
    const mockBooking = { id: 1, status: 'pending' } as Booking;
    commandBus.execute.mockResolvedValue({ ...mockBooking, status: 'confirmed' });

    const result = await service.confirmBooking(1);
    expect(result.status).toBe('confirmed');
    expect(commandBus.execute).toHaveBeenCalledWith(expect.any(ConfirmBookingCommand));
    
    const command = commandBus.execute.mock.calls[0][0] as ConfirmBookingCommand;
    expect(command).toBeInstanceOf(ConfirmBookingCommand);
    expect(command.id).toBe(1);
  });

  it('should cancel a booking', async () => {
    const mockBooking = { id: 1, status: 'pending' } as Booking;
    commandBus.execute.mockResolvedValue({ ...mockBooking, status: 'cancelled' });

    const result = await service.cancelBooking(1);
    expect(result.status).toBe('cancelled');
    expect(commandBus.execute).toHaveBeenCalledWith(expect.any(CancelBookingCommand));
    
    const command = commandBus.execute.mock.calls[0][0] as CancelBookingCommand;
    expect(command).toBeInstanceOf(CancelBookingCommand);
    expect(command.id).toBe(1);
  });

  it('should throw error when confirming non-existent booking', async () => {
    commandBus.execute.mockRejectedValue(new BadRequestException('Booking not found'));
    await expect(service.confirmBooking(999)).rejects.toThrow('Booking not found');
  });

  it('should throw error when cancelling non-existent booking', async () => {
    commandBus.execute.mockRejectedValue(new BadRequestException('Booking not found'));
    await expect(service.cancelBooking(999)).rejects.toThrow('Booking not found');
  });
});