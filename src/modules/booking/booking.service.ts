import { Injectable, BadRequestException, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entity/booking.entity';
import { UserService } from '../user/user.service';
import { ResourceService } from '../resource/resource.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingRange } from './interfaces/booking-range.interface';

// Commands
import { CreateBookingCommand } from './commands/create-booking.command';
import { ConfirmBookingCommand } from './commands/confirm-booking.command';
import { CancelBookingCommand } from './commands/cancel-booking.command';

// Queries
import { GetBookingByIdQuery } from './queries/get-booking-by-id.query';
import { GetBookingsByUserQuery } from './queries/get-bookings-by-user.query';
import { GetBookingsByResourceQuery } from './queries/get-bookings-by-resource.query';
import { GetAllBookingsQuery } from './queries/get-all-bookings.query';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => ResourceService))
    private resourceService: ResourceService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createBooking(bookingData: CreateBookingDto) {
    return this.commandBus.execute(
      new CreateBookingCommand(
        bookingData.userId,
        bookingData.resourceId,
        bookingData.startTime,
        bookingData.endTime,
      ),
    );
  }

  async getBookingById(id: number) {
    return this.queryBus.execute(new GetBookingByIdQuery(id));
  }

  async getAllBookings(userId?: number, resourceId?: number) {
    if (userId) return this.queryBus.execute(new GetBookingsByUserQuery(userId));
    if (resourceId) return this.queryBus.execute(new GetBookingsByResourceQuery(resourceId));
    return this.queryBus.execute(new GetAllBookingsQuery());
  }

  async confirmBooking(id: number) {
    return this.commandBus.execute(new ConfirmBookingCommand(id));
  }

  async cancelBooking(id: number) {
    return this.commandBus.execute(new CancelBookingCommand(id));
  }

  public getAvailableDates(
    bookings: BookingRange[],
    from: Date,
    to: Date
  ): string[] {
    const availableDates: string[] = [];
    const currentDate = new Date(from);

    while (currentDate <= to) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const isBooked = bookings.some(b =>
        currentDate >= b.start && currentDate <= b.end
      );
      if (!isBooked) {
        availableDates.push(dateStr);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return availableDates;
  }

  public getReservedDateRanges(bookings: BookingRange[]): { start: string; end: string }[] {
    return bookings.map(b => ({
      start: b.start.toISOString().split('T')[0],
      end: b.end.toISOString().split('T')[0],
    }));
  }

  private canCreateBooking(
    requested: BookingRange,
    existing: BookingRange[],
    now?: Date
  ): { allowed: boolean; reason?: string } {
    if (requested.start >= requested.end) {
      return { allowed: false, reason: 'Start date must be before end date' };
    }
    if (now && requested.start < now) {
      return { allowed: false, reason: 'Cannot book in the past' };
    }
    const hasOverlap = existing.some(b => this.isBookingOverlap(b, requested));
    if (hasOverlap) {
      return { allowed: false, reason: 'Booking overlaps with existing booking' };
    }
    return { allowed: true };
  }

  public isBookingOverlap(a: BookingRange, b: BookingRange): boolean {
    return a.start < b.end && a.end > b.start;
  }

  async create(booking: CreateBookingDto): Promise<Booking> {
    const resource = await this.resourceService.findOne(booking.resourceId);
    if (!resource) throw new BadRequestException('Resource not found');
    const user = await this.userService.findOne(booking.userId);
    if (!user) throw new BadRequestException('User not found');

    // Get all confirmed bookings for this resource
    const existingBookings = await this.findBookingsForResource(booking.resourceId);
    const now = new Date();
    const result = this.canCreateBooking(
      { start: new Date(booking.startTime), end: new Date(booking.endTime) },
      existingBookings.map(b => ({ start: new Date(b.startTime), end: new Date(b.endTime) })),
      now,
    );
    if (!result.allowed) throw new BadRequestException(result.reason);

    return this.bookingRepo.save({
      user,
      resource,
      startTime: new Date(booking.startTime),
      endTime: new Date(booking.endTime),
      status: 'pending',
    });
  }

  async findOne(id: number): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingRepo.find();
  }

  async findByUser(userId: number): Promise<Booking[]> {
    return this.bookingRepo.find({ where: { user: { id: userId } } });
  }

  async findByResource(resourceId: number): Promise<Booking[]> {
    return this.bookingRepo.find({ where: { resource: { id: resourceId } } });
  }

  async confirm(id: number): Promise<Booking> {
    const booking = await this.findOne(id);
    if (booking.status !== 'pending') throw new BadRequestException('Booking cannot be confirmed');
    const resource = await this.resourceService.findOne(booking.resource.id);
    if (!resource) throw new BadRequestException('Resource not found');

    // Get all confirmed bookings for this resource (excluding this booking)
    const existingBookings = (await this.findBookingsForResource(booking.resource.id)).filter(b => b.id !== booking.id);
    const now = new Date();
    const result = this.canCreateBooking(
      { start: booking.startTime, end: booking.endTime },
      existingBookings.map(b => ({ start: new Date(b.startTime), end: new Date(b.endTime) })),
      now,
    );
    if (!result.allowed) throw new BadRequestException(result.reason);

    booking.status = 'confirmed';
    return this.bookingRepo.save(booking);
  }

  async cancel(id: number): Promise<Booking> {
    const booking = await this.findOne(id);
    booking.status = 'cancelled';
    return this.bookingRepo.save(booking);
  }

  async findBookingsForResource(resourceId: number) {
    return this.bookingRepo.find({
      where: { resource: { id: resourceId }, status: 'confirmed' },
      order: { startTime: 'ASC' },
      relations: ['resource'],
    });
  }

  async findAllConfirmed() {
    return this.bookingRepo.find({
      where: { status: 'confirmed' },
      relations: ['resource'],
    });
  }
} 