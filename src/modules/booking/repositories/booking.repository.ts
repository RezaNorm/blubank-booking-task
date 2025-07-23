import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindManyOptions, FindOneOptions, DeepPartial } from 'typeorm';
import { Booking, BookingStatus } from '../entity/booking.entity';
import { IBookingRepository } from './booking.repository.interface';
import { BaseRepository } from '../../../database/base.repository';

@Injectable()
export class BookingRepository
  extends BaseRepository<Booking>
  implements IBookingRepository
{
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {
    super(bookingRepository);
  }

  create(entityLike: DeepPartial<Booking>): Booking {
    const booking = this.bookingRepository.create(entityLike);
    return booking as Booking;
  }

  async findBookingsForResource(resourceId: number): Promise<Booking[]> {
    return this.findAll({
      where: { resource: { id: resourceId }, status: BookingStatus.CONFIRMED },
      order: { startTime: 'ASC' },
      relations: ['resource'],
    });
  }

  async findBookingsByUser(userId: number): Promise<Booking[]> {
    return this.findAll({
      where: { user: { id: userId } },
      order: { startTime: 'DESC' },
      relations: ['resource'],
    });
  }

  async findBookingsInTimeRange(
    startTime: Date,
    endTime: Date,
    resourceId?: number,
  ): Promise<Booking[]> {
    // Create query builder
    const qb = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.resource', 'resource')
      .where('booking.status = :status', { status: 'confirmed' });

    // Add time range conditions
    qb.andWhere('booking.startTime < :endTime', { endTime })
      .andWhere('booking.endTime > :startTime', { startTime });

    // Add resource filter if provided
    if (resourceId) {
      qb.andWhere('booking.resourceId = :resourceId', { resourceId });
    }

    return qb.getMany();
  }

  async findOneWithRelations(
    options: FindOneOptions<Booking>,
  ): Promise<Booking | null> {
    return this.bookingRepository.findOne({
      ...options,
      relations: ['user', 'resource'],
    });
  }

  async findWithRelations(
    options?: FindManyOptions<Booking>,
  ): Promise<Booking[]> {
    return this.bookingRepository.find({
      ...options,
      relations: ['user', 'resource'],
    });
  }

  async findOne(options: FindOneOptions<Booking>): Promise<Booking | null> {
    return this.bookingRepository.findOne({
      ...options,
      relations: ['user', 'resource'],
    });
  }

  async update(id: number, entity: Partial<Booking>): Promise<Booking | null> {
    await this.bookingRepository.update(id, entity);
    return this.findOne({ where: { id } });
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.bookingRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
