import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'macbook',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'booking',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
} as const;

export const typeOrmModuleOptions: TypeOrmModuleOptions = databaseConfig;

export default databaseConfig;
