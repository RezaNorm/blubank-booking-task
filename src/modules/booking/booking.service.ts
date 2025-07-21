import { Injectable, BadRequestException, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entity/booking.entity';
import { UserService } from '../user/user.service';
import { ResourceService } from '../resource/resource.service';
import { IBookingPolicy } from './policy/booking-policy.interface';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => ResourceService))
    private resourceService: ResourceService,
    @Inject('IBookingPolicy')
    private bookingPolicy: IBookingPolicy,
  ) {}

  async create(booking: { userId: number; resourceId: number; startTime: string; endTime: string }): Promise<Booking> {
    const resource = await this.resourceService.findOne(booking.resourceId);
    if (!resource) throw new BadRequestException('Resource not found');
    const user = await this.userService.findOne(booking.userId);
    if (!user) throw new BadRequestException('User not found');

    // Get all confirmed bookings for this resource
    const existingBookings = await this.findBookingsForResource(booking.resourceId);
    const now = new Date();
    const result = this.bookingPolicy.canCreateBooking(
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
    const result = this.bookingPolicy.canCreateBooking(
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