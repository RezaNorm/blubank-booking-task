import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetReservedDatesQuery } from '../impl/get-reserved-dates.query';
import { BookingService } from '../../../../modules/booking/booking.service';

@QueryHandler(GetReservedDatesQuery)
export class GetReservedDatesHandler implements IQueryHandler<GetReservedDatesQuery> {
  constructor(
    private readonly bookingService: BookingService,
  ) {}

  async execute(query: GetReservedDatesQuery): Promise<Date[]> {
    const { resourceId, startDate, endDate } = query;
    
    const bookings = await this.bookingService.getBookingsInTimeRange(
      startDate,
      endDate,
      resourceId
    );

    // Flatten all booked time slots into an array of dates
    const reservedDates: Date[] = [];
    
    for (const booking of bookings) {
      const currentDate = new Date(booking.startTime);
      const bookingEndDate = new Date(booking.endTime);
      
      while (currentDate <= bookingEndDate) {
        // Create a new Date object to avoid reference issues
        reservedDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return reservedDates;
  }
}
