import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { CreateBookingCommand } from '../impl/create-booking.command';
import { Booking, BookingStatus } from '../../entity/booking.entity';
import { IBookingRepository, BOOKING_REPOSITORY } from '../../repositories/booking.repository.interface';
import { HistoryService } from '../../../history/history.service';
import { IUserRepository, USER_REPOSITORY } from '../../../user/repositories/user.repository.interface';
import { IResourceRepository, RESOURCE_REPOSITORY } from '../../../resource/repositories/resource.repository.interface';

@CommandHandler(CreateBookingCommand)
export class CreateBookingHandler implements ICommandHandler<CreateBookingCommand> {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: IBookingRepository,
    private readonly historyService: HistoryService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(RESOURCE_REPOSITORY)
    private readonly resourceRepository: IResourceRepository,
  ) {}

  async execute(command: CreateBookingCommand): Promise<Booking> {
    // Check if user exists
    const user = await this.userRepository.findById(command.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if resource exists
    const resource = await this.resourceRepository.findById(command.resourceId);
    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    // Ensure dates are Date objects
    const startTime = new Date(command.startTime);
    const endTime = new Date(command.endTime);
    
    // Check for overlapping bookings
    const overlappingBookings = await this.bookingRepository.findBookingsInTimeRange(
      startTime,
      endTime,
      command.resourceId
    );

    if (overlappingBookings.length > 0) {
      throw new BadRequestException('Resource is already booked for the selected time period');
    }

    // Create new booking
    const newBooking = this.bookingRepository.create({
      user: { id: command.userId },
      resource: { id: command.resourceId },
      startTime: startTime,
      endTime: endTime,
      status: BookingStatus.PENDING,
    });

    const savedBooking = await this.bookingRepository.save(newBooking);
    
    // Record history
    await this.historyService.record('booking', savedBooking.id, 'created', { ...savedBooking });
    
    // Return the booking with relations
    return this.bookingRepository.findOneWithRelations({
      where: { id: savedBooking.id },
      relations: ['user', 'resource']
    }) as Promise<Booking>;
  }
} 