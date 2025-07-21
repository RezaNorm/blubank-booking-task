import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource } from './entity/resource.entity';
import { BookingService } from '../booking/booking.service';
import { isBookingOverlap, getAvailableDates, getReservedDateRanges } from '../booking/util/booking.util';

@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(Resource)
    private resourceRepo: Repository<Resource>,
    @Inject(forwardRef(() => BookingService))
    private bookingService: BookingService,
  ) {}


  async findOne(id: number) {
    const resource = await this.resourceRepo.findOne({ where: { id } });
    if (!resource) return null;
    return resource
  }

  async findAvailable(startTime: Date, endTime: Date) {
    const resources = await this.resourceRepo.find();
    const bookings = await this.bookingService.findAllConfirmed();
    return resources.filter(resource => {
      const resourceBookings = bookings.filter(b => b.resource.id === resource.id);
      const hasOverlap = resourceBookings.some(booking =>
        isBookingOverlap(
          { start: new Date(booking.startTime), end: new Date(booking.endTime) },
          { start: startTime, end: endTime }
        )
      );
      return !hasOverlap;
    });
  }

  async getReservedDates(resourceId: number) {
    const bookings = await this.bookingService.findBookingsForResource(resourceId);
    return getReservedDateRanges(
      bookings.map(b => ({
        start: new Date(b.startTime),
        end: new Date(b.endTime),
      }))
    );
  }
}
