import { describe, it, expect } from 'vitest';
import {
  canRead,
  canWrite,
  recordRead,
  recordWrite,
  resetTick,
  DEFAULT_READ_BUDGET,
  DEFAULT_WRITE_BUDGET,
  type IOBudgetState,
} from './chunk_io_queue_budget';

const init: IOBudgetState = {
  bytesThisTickRead: 0,
  bytesThisTickWrite: 0,
  readBudgetBytes: DEFAULT_READ_BUDGET,
  writeBudgetBytes: DEFAULT_WRITE_BUDGET,
};

describe('chunk IO queue budget', () => {
  it('fresh tick allows reads', () => {
    expect(canRead(init, 1024)).toBe(true);
  });

  it('over budget rejected', () => {
    expect(canRead(init, DEFAULT_READ_BUDGET + 1)).toBe(false);
  });

  it('record accumulates', () => {
    expect(recordRead(init, 500).bytesThisTickRead).toBe(500);
  });

  it('write budget separate', () => {
    expect(canWrite(init, 1024)).toBe(true);
  });

  it('reset clears counters', () => {
    const used = recordWrite(recordRead(init, 100), 50);
    const r = resetTick(used);
    expect(r.bytesThisTickRead).toBe(0);
    expect(r.bytesThisTickWrite).toBe(0);
  });
});
