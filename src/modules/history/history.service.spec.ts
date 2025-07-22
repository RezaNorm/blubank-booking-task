import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityHistory } from './entity/entity-history.entity';
import { HistoryService } from './history.service';

describe('HistoryService', () => {
  let service: HistoryService;
  let commandBus: jest.Mocked<CommandBus>;
  let queryBus: jest.Mocked<QueryBus>;
  let historyRepo: any;

  beforeEach(async () => {
    const mockCommandBus = { execute: jest.fn() };
    const mockQueryBus = { execute: jest.fn() };
    historyRepo = { create: jest.fn(), save: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HistoryService,
        { provide: CommandBus, useValue: mockCommandBus },
        { provide: QueryBus, useValue: mockQueryBus },
        { provide: getRepositoryToken(EntityHistory), useValue: historyRepo },
      ],
    }).compile();

    commandBus = module.get<CommandBus>(CommandBus) as jest.Mocked<CommandBus>;
    queryBus = module.get<QueryBus>(QueryBus) as jest.Mocked<QueryBus>;

    service = module.get<HistoryService>(HistoryService);
  });

  it('should record an entity history entry', async () => {
    const entity = 'booking';
    const entityId = 1;
    const action = 'created';
    const snapshot = { id: 1, status: 'pending' };
    const mockHistory = { id: 1, entity, entityId, action, snapshot };
    
    commandBus.execute.mockResolvedValue(mockHistory);

    const result = await service.record(entity, entityId, action, snapshot);
    
    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        entity,
        entityId,
        action,
        snapshot
      })
    );
    expect(result).toEqual(mockHistory);
  });
  
  it('should get entity history', async () => {
    const entity = 'booking';
    const entityId = 1;
    const mockHistory = [
      { id: 1, entity, entityId, action: 'created', snapshot: { status: 'pending' } },
      { id: 2, entity, entityId, action: 'updated', snapshot: { status: 'confirmed' } }
    ];
    
    queryBus.execute.mockResolvedValue(mockHistory);

    const result = await service.getEntityHistory(entity, entityId);
    
    expect(queryBus.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        entity,
        entityId
      })
    );
    expect(result).toEqual(mockHistory);
  });
  
  it('should handle errors when recording history', async () => {
    const error = new Error('Failed to record history');
    commandBus.execute.mockRejectedValue(error);
    
    await expect(
      service.record('booking', 1, 'created', { id: 1 })
    ).rejects.toThrow(error);
  });
});