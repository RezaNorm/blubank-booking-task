import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

// Import all entities
import { User } from '../../modules/user/entity/user.entity';
import { Resource } from '../../modules/resource/entity/resource.entity';
import { Booking } from '../../modules/booking/entity/booking.entity';
import { EntityHistory } from '../../modules/history/entity/entity-history.entity';

const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'booking',
  entities: [
    User,
    Resource,
    Booking,
    EntityHistory
  ],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
} as const;

export const typeOrmModuleOptions: TypeOrmModuleOptions = databaseConfig;

export default databaseConfig;
