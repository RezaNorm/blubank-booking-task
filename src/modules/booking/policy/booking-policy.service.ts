import { Injectable } from '@nestjs/common';
import { IBookingPolicy } from './booking-policy.interface';
import { BookingRange, isBookingOverlap } from '../util/booking.util';

@Injectable()
export class BookingPolicyService implements IBookingPolicy {
  canCreateBooking(
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
    const hasOverlap = existing.some(b => isBookingOverlap(b, requested));
    if (hasOverlap) {
      return { allowed: false, reason: 'Booking overlaps with existing booking' };
    }
    return { allowed: true };
  }
} 