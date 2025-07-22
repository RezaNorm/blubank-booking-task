import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Resource } from '../entity/resource.entity';
import { IResourceRepository, RESOURCE_REPOSITORY } from './resource.repository.interface';
import { BaseRepository } from '../../../database/base.repository';
import { Booking } from '../../booking/entity/booking.entity';
import { BookingStatus } from "../../booking/entity/booking.entity"

@Injectable()
export class ResourceRepository
  extends BaseRepository<Resource>
  implements IResourceRepository
{
  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {
    super(resourceRepository);
  }

  async findAll(): Promise<Resource[]> {
    return this.find();
  }

  async findByName(name: string): Promise<Resource | null> {
    return this.findOne({ where: { name } });
  }

  async findAvailableResources(startTime: Date, endTime: Date): Promise<Resource[]> {
    // Find all resources
    const allResources = await this.findAll();
    
    // Find resources that have bookings in the given time range
    const bookedResources = await this.bookingRepository
      .createQueryBuilder('booking')
      .innerJoinAndSelect('booking.resource', 'resource')
      .where('booking.startTime < :endTime AND booking.endTime > :startTime', {
        startTime,
        endTime,
      })
      .andWhere('booking.status = :status', { status: BookingStatus.CONFIRMED })
      .select('resource.id')
      .getMany();

    // Get IDs of booked resources
    const bookedResourceIds = new Set(bookedResources.map(br => br.resource.id));

    // Filter out the booked resources
    return allResources.filter(resource => !bookedResourceIds.has(resource.id));
  }

  async getReservedDates(resourceId: number, startDate: Date, endDate: Date): Promise<Date[]> {
    const bookings = await this.bookingRepository.find({
      where: {
        resource: { id: resourceId },
        status: BookingStatus.CONFIRMED,
        startTime: Between(startDate, endDate),
      },
      select: ['startTime', 'endTime'],
    });

    // Extract all dates from the bookings
    const reservedDates: Date[] = [];
    
    bookings.forEach(booking => {
      const currentDate = new Date(booking.startTime);
      const endDate = new Date(booking.endTime);
      
      while (currentDate <= endDate) {
        reservedDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    return reservedDates;
  }

  // Implement the findOne method from the base repository
  async findOne(options: FindOneOptions<Resource>): Promise<Resource | null> {
    return this.resourceRepository.findOne({
      ...options,
      relations: [],
    });
  }

  // Implement the update method
  async update(id: number, entity: Partial<Resource>): Promise<Resource | null> {
    await this.resourceRepository.update(id, entity);
    return this.findOne({ where: { id } });
  }

  // Implement the delete method
  async delete(id: number): Promise<boolean> {
    const result = await this.resourceRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
