import { BookingRange } from '../util/booking.util';

export interface IBookingPolicy {
  canCreateBooking(
    requested: BookingRange,
    existing: BookingRange[],
    now?: Date
  ): { allowed: boolean; reason?: string };
} 