import { DataSource } from 'typeorm';
import { seed } from './seed';
import databaseConfig from '../config/database.config';

async function runSeed() {
  const datasource = new DataSource({
    ...databaseConfig,
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