import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class EntityHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  entity: string; // e.g., 'booking', 'resource', 'user'

  @Column()
  entityId: number;

  @Column()
  action: string; // e.g., 'created', 'updated', 'deleted', 'confirmed', 'cancelled'

  @Column('jsonb')
  snapshot: any;

  @CreateDateColumn()
  timestamp: Date;
} 