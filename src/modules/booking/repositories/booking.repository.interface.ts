import { FindManyOptions, FindOneOptions, DeepPartial } from 'typeorm';
import { Booking } from '../entity/booking.entity';

export const BOOKING_REPOSITORY = 'BOOKING_REPOSITORY';

export interface IBookingRepository {
  create(entityLike: DeepPartial<Booking>): Booking;
  save(entity: DeepPartial<Booking>): Promise<Booking>;
  findById(id: number): Promise<Booking | null>;
  findAll(options?: FindManyOptions<Booking>): Promise<Booking[]>;
  
  findBookingsForResource(resourceId: number): Promise<Booking[]>;
  findBookingsByUser(userId: number): Promise<Booking[]>;
  findBookingsInTimeRange(startTime: Date, endTime: Date, resourceId?: number): Promise<Booking[]>;
  findOneWithRelations(options: FindOneOptions<Booking>): Promise<Booking | null>;
  findWithRelations(options?: FindManyOptions<Booking>): Promise<Booking[]>;
  
  findOne(options: FindOneOptions<Booking>): Promise<Booking | null>;
  update(id: number, entity: Partial<Booking>): Promise<Booking | null>;
  delete(id: number): Promise<boolean>;
}
