import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let queryBus: jest.Mocked<QueryBus>;
  let userRepo: any;

  beforeEach(async () => {
    const mockQueryBus = { execute: jest.fn() };
    userRepo = { save: jest.fn(), findOne: jest.fn(), find: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: QueryBus, useValue: mockQueryBus },
        { provide: getRepositoryToken(User), useValue: userRepo },
      ],
    }).compile();

    queryBus = module.get<QueryBus>(QueryBus) as jest.Mocked<QueryBus>;

    service = module.get<UserService>(UserService);
  });

  it('should return all users', async () => {
    const mockUsers = [{ id: 1 }, { id: 2 }];
    queryBus.execute.mockResolvedValue(mockUsers);
    
    const result = await service.findAll();
    
    expect(queryBus.execute).toHaveBeenCalledWith(expect.any(Object));
    expect(result).toEqual(mockUsers);
  });
}); 