import { DataSource } from 'typeorm';
import { seed } from './seed';
import { User } from '../../modules/user/entity/user.entity';
import { Resource } from '../../modules/resource/entity/resource.entity';
import { Booking } from '../../modules/booking/entity/booking.entity';

async function runSeed() {
  const datasource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'booking',
    entities: [User, Resource, Booking],
    synchronize: true,
  });

  try {
    await datasource.initialize();
    console.log('Database connected');
    
    await seed(datasource);
    
    await datasource.destroy();
    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

runSeed(); 