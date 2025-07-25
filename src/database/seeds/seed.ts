import { DataSource } from 'typeorm';
import { User } from '../../modules/user/entity/user.entity';
import { Resource } from '../../modules/resource/entity/resource.entity';

export async function seed(datasource: DataSource) {
  console.log('Starting database reset...');
  
  const userRepository = datasource.getRepository(User);
  const resourceRepository = datasource.getRepository(Resource);

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

  console.log('Starting to seed data...');
  
  // Insert users
  const createdUsers: User[] = [];
  for (const userData of users) {
    const user = userRepository.create(userData);
    const savedUser = await userRepository.save(user);
    createdUsers.push(savedUser);
    console.log(`Created user: ${savedUser.email}`);
  }

  // Insert resources
  const createdResources: Resource[] = [];
  for (const resourceData of resources) {
    const resource = resourceRepository.create(resourceData);
    const savedResource = await resourceRepository.save(resource);
    createdResources.push(savedResource);
    console.log(`Created resource: ${savedResource.name}`);
  }

  console.log('Seeding completed successfully!');
  return {
    users: createdUsers,
    resources: createdResources
  };
} 