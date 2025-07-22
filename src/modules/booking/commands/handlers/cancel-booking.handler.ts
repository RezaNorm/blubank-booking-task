import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { CancelBookingCommand } from '../impl/cancel-booking.command';
import { Booking, BookingStatus } from '../../entity/booking.entity';
import { IBookingRepository, BOOKING_REPOSITORY } from '../../repositories/booking.repository.interface';
import { HistoryService } from '../../../history/history.service';

@CommandHandler(CancelBookingCommand)
export class CancelBookingHandler implements ICommandHandler<CancelBookingCommand> {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: IBookingRepository,
    private readonly historyService: HistoryService,
  ) {}

  async execute(command: CancelBookingCommand): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({ where: { id: command.id } });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    
    const updatedBooking = await this.bookingRepository.update(command.id, { 
      ...booking, 
      status: BookingStatus.CANCELLED 
    });
    
    if (!updatedBooking) {
      throw new BadRequestException('Failed to cancel booking');
    }
    
    await this.historyService.record('booking', updatedBooking.id, 'cancelled', { ...updatedBooking });
    return updatedBooking;
  }
} 