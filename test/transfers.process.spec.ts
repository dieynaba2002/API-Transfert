import { TransfersService } from './../src/transfers/transfers.service';

describe('TransfersService - process flow', () => {
  it('should update status to PROCESSING then SUCCESS if provider ok', async () => {
    const mockRepo = {
      findById: jest.fn().mockResolvedValue({ _id: '1', status: 'PENDING' }),
      update: jest.fn().mockResolvedValue({ _id: '1', status: 'SUCCESS' }),
    };
    const mockAudit = { log: jest.fn() };
    // mock provider simulator
    jest
      .spyOn(
        require('../src/transfers/provider.simulator'),
        'ProviderSimulator',
      )
      .mockImplementation({
        process: async () => ({ success: true, provider_ref: 'PRV-123' }),
      } as any);

    const svc = new (TransfersService as any)(mockRepo, mockAudit);
    const res = await svc.process('1');
    expect(mockRepo.update).toHaveBeenCalled();
    expect(res.status).toBe('SUCCESS');
  });
});
