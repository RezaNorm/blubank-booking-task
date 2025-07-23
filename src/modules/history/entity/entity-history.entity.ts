import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class EntityHistory {
  @ApiProperty({
    description: 'Unique identifier of the history entry',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Type of the entity being tracked',
    example: 'booking',
    enum: ['booking', 'user', 'resource']
  })
  @Column()
  entity: string;

  @ApiProperty({
    description: 'ID of the entity being tracked',
    example: 42,
  })
  @Column()
  entityId: number;

  @ApiProperty({
    description: 'Action performed on the entity',
    example: 'created',
    enum: ['created', 'updated', 'deleted', 'confirmed', 'cancelled']
  })
  @Column()
  action: string;

  @ApiProperty({
    description: 'Snapshot of the entity state at the time of the action',
    type: 'object',
    additionalProperties: true,
    example: {
      id: 42,
      status: 'confirmed',
      startTime: '2025-07-23T10:00:00.000Z',
      endTime: '2025-07-25T12:00:00.000Z'
    }
  })
  @Column('jsonb')
  snapshot: any;

  @ApiProperty({
    description: 'Timestamp when the action was performed',
    type: 'string',
    format: 'date-time',
    example: '2025-07-23T12:34:56.789Z'
  })
  @CreateDateColumn()
  timestamp: Date;
} 