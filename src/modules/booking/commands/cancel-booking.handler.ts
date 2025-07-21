import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CancelBookingCommand } from './cancel-booking.command';
import { BookingService } from '../booking.service';
import { Booking } from '../entity/booking.entity';
import { HistoryService } from '../../history/history.service';

@CommandHandler(CancelBookingCommand)
export class CancelBookingHandler implements ICommandHandler<CancelBookingCommand> {
  constructor(
    private readonly bookingService: BookingService,
    private readonly historyService: HistoryService,
  ) {}

  async execute(command: CancelBookingCommand): Promise<Booking> {
    const booking = await this.bookingService.cancel(command.id);
    await this.historyService.record('booking', booking.id, 'cancelled', { ...booking });
    return booking;
  }
} 