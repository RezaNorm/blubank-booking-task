import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entity/user.entity';

describe('UserService', () => {
  let service: UserService;
  let userRepo: any;

  beforeEach(async () => {
    userRepo = { save: jest.fn(), findOne: jest.fn(), find: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: userRepo },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should create a user', async () => {
    userRepo.save.mockResolvedValue({ id: 1, name: 'John' });
    const result = await service.create({ name: 'John' });
    expect(result).toEqual({ id: 1, name: 'John' });
    expect(userRepo.save).toHaveBeenCalled();
  });

  it('should find a user by id', async () => {
    userRepo.findOne.mockResolvedValue({ id: 1, name: 'John' });
    const result = await service.findOne(1);
    expect(result).toEqual({ id: 1, name: 'John' });
  });

  it('should return null if user not found', async () => {
    userRepo.findOne.mockResolvedValue(null);
    const result = await service.findOne(1);
    expect(result).toBeNull();
  });

  it('should return all users', async () => {
    userRepo.find.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    const result = await service.findAll();
    expect(result.length).toBe(2);
  });
}); 