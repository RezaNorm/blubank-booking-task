import { Test, TestingModule } from '@nestjs/testing';
import { HistoryService } from './history.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityHistory } from './entity/entity-history.entity';

describe('HistoryService', () => {
  let service: HistoryService;
  let historyRepo: any;

  beforeEach(async () => {
    historyRepo = { create: jest.fn(), save: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HistoryService,
        { provide: getRepositoryToken(EntityHistory), useValue: historyRepo },
      ],
    }).compile();

    service = module.get<HistoryService>(HistoryService);
  });

  it('should record an entity history entry', async () => {
    const entity = 'booking';
    const entityId = 1;
    const action = 'created';
    const snapshot = { id: 1, status: 'pending' };
    const entry = { entity, entityId, action, snapshot };
    historyRepo.create.mockReturnValue(entry);
    historyRepo.save.mockResolvedValue(entry);

    await service.record(entity, entityId, action, snapshot);
    expect(historyRepo.create).toHaveBeenCalledWith({ entity, entityId, action, snapshot });
    expect(historyRepo.save).toHaveBeenCalledWith(entry);
  });
}); 