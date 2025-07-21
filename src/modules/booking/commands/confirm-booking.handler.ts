import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfirmBookingCommand } from './confirm-booking.command';
import { BookingService } from '../booking.service';
import { Booking } from '../entity/booking.entity';
import { HistoryService } from '../../history/history.service';

@CommandHandler(ConfirmBookingCommand)
export class ConfirmBookingHandler implements ICommandHandler<ConfirmBookingCommand> {
  constructor(
    private readonly bookingService: BookingService,
    private readonly historyService: HistoryService,
  ) {}

  async execute(command: ConfirmBookingCommand): Promise<Booking> {
    const booking = await this.bookingService.confirm(command.id);
    await this.historyService.record('booking', booking.id, 'confirmed', { ...booking });
    return booking;
  }
} 