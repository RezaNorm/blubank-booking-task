import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { ConfirmBookingCommand } from '../impl/confirm-booking.command';
import { Booking, BookingStatus } from '../../entity/booking.entity';
import { IBookingRepository, BOOKING_REPOSITORY } from '../../repositories/booking.repository.interface';
import { HistoryService } from '../../../history/history.service';

@CommandHandler(ConfirmBookingCommand)
export class ConfirmBookingHandler implements ICommandHandler<ConfirmBookingCommand> {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: IBookingRepository,
    private readonly historyService: HistoryService,
  ) {}

  async execute(command: ConfirmBookingCommand): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({ where: { id: command.id } });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    
    const updatedBooking = await this.bookingRepository.update(command.id, { 
      ...booking, 
      status: BookingStatus.CONFIRMED 
    });
    
    if (!updatedBooking) {
      throw new BadRequestException('Failed to confirm booking');
    }
    
    await this.historyService.record('booking', updatedBooking.id, 'confirmed', { ...updatedBooking });
    return updatedBooking;
  }
} 