import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let commandBus: jest.Mocked<CommandBus>;
  let queryBus: jest.Mocked<QueryBus>;
  let userRepo: any;

  beforeEach(async () => {
    const mockCommandBus = { execute: jest.fn() };
    const mockQueryBus = { execute: jest.fn() };
    userRepo = { save: jest.fn(), findOne: jest.fn(), find: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: CommandBus, useValue: mockCommandBus },
        { provide: QueryBus, useValue: mockQueryBus },
        { provide: getRepositoryToken(User), useValue: userRepo },
      ],
    }).compile();

    commandBus = module.get<CommandBus>(CommandBus) as jest.Mocked<CommandBus>;
    queryBus = module.get<QueryBus>(QueryBus) as jest.Mocked<QueryBus>;

    service = module.get<UserService>(UserService);
  });

  it('should create a user', async () => {
    const mockUser = { id: 1, name: 'John', email: 'john@example.com' };
    commandBus.execute.mockResolvedValue(mockUser);
    
    const result = await service.create({ 
      name: 'John',
      email: 'john@example.com'
    });
    
    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        userData: {
          name: 'John',
          email: 'john@example.com'
        }
      })
    );
    expect(result).toEqual(mockUser);
  });

  it('should find a user by id', async () => {
    const mockUser = { id: 1, name: 'John' };
    queryBus.execute.mockResolvedValue(mockUser);
    
    const result = await service.findOne(1);
    
    expect(queryBus.execute).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 1 })
    );
    expect(result).toEqual(mockUser);
  });

  it('should return null if user not found', async () => {
    queryBus.execute.mockResolvedValue(null);
    
    const result = await service.findOne(999);
    
    expect(queryBus.execute).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 999 })
    );
    expect(result).toBeNull();
  });

  it('should return all users', async () => {
    const mockUsers = [{ id: 1 }, { id: 2 }];
    queryBus.execute.mockResolvedValue(mockUsers);
    
    const result = await service.findAll();
    
    expect(queryBus.execute).toHaveBeenCalledWith(expect.any(Object));
    expect(result).toEqual(mockUsers);
  });
  
  it('should handle errors when creating a user', async () => {
    const error = new Error('Failed to create user');
    commandBus.execute.mockRejectedValue(error);
    
    await expect(service.create({ 
      name: 'John',
      email: 'john@example.com'
    })).rejects.toThrow(error);
  });
}); 