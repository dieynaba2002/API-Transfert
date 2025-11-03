// test/transfers.service.spec.ts
import { TransfersService } from './../src/transfers/transfers.service';

describe('TransfersService - fees', () => {
  it('calcFees respects min and max', () => {
    // on instancie sans repo/audit en bricolant le constructeur via any
    const svc = new (TransfersService as any)({}, { log: () => {} });
    expect(svc).toBe(100); // min
    expect(svc).toBe(1500); // max
    expect(svc).toBe(Math.ceil(12500 * 0.008));
  });
});
