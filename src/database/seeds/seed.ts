import { DataSource } from 'typeorm';
import { User } from '../../modules/user/entity/user.entity';
import { Resource } from '../../modules/resource/entity/resource.entity';

export async function seed(datasource: DataSource) {
  const userRepository = datasource.getRepository(User);
  const resourceRepository = datasource.getRepository(Resource);

  // Create sample users
  const users = [
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
    },
    {
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
    },
  ];

  // Create sample resources (hotel rooms)
  const resources = [
    {
      name: 'Room 101',
      description: 'Single bed room with city view',
    },
    {
      name: 'Room 102',
      description: 'Double bed room with garden view',
    },
    {
      name: 'Room 103',
      description: 'Suite with balcony',
    },
    {
      name: 'Room 201',
      description: 'Family room with 2 beds',
    },
    {
      name: 'Room 202',
      description: 'Deluxe room with ocean view',
    },
  ];

  // Insert users
  for (const userData of users) {
    const existingUser = await userRepository.findOne({
      where: { email: userData.email },
    });
    if (!existingUser) {
      await userRepository.save(userData);
      console.log(`Created user: ${userData.name}`);
    }
  }

  // Insert resources
  for (const resourceData of resources) {
    const existingResource = await resourceRepository.findOne({
      where: { name: resourceData.name },
    });
    if (!existingResource) {
      await resourceRepository.save(resourceData);
      console.log(`Created resource: ${resourceData.name}`);
    }
  }

  console.log('Seeding completed!');
} 