import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBookingCommand } from './create-booking.command';
import { BookingService } from '../booking.service';
import { Booking } from '../entity/booking.entity';
import { HistoryService } from '../../history/history.service';

@CommandHandler(CreateBookingCommand)
export class CreateBookingHandler implements ICommandHandler<CreateBookingCommand> {
  constructor(
    private readonly bookingService: BookingService,
    private readonly historyService: HistoryService,
  ) {}

  async execute(command: CreateBookingCommand): Promise<Booking> {
    const booking = await this.bookingService.create({
      userId: command.userId,
      resourceId: command.resourceId,
      startTime: command.startTime,
      endTime: command.endTime,
    });
    await this.historyService.record('booking', booking.id, 'created', { ...booking });
    return booking;
  }
} 