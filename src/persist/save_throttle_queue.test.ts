import { describe, it, expect } from 'vitest';
import { markDirty, shouldFlush, drainBatch, type ThrottleState } from './save_throttle_queue';

function make(): ThrottleState {
  return {
    dirtySet: new Set(),
    lastFlushMs: 0,
    minFlushIntervalMs: 1000,
    maxBatchSize: 5,
  };
}

describe('save throttle queue', () => {
  it('empty no flush', () => {
    expect(shouldFlush(make(), 5000)).toBe(false);
  });

  it('interval triggers flush', () => {
    const s = make();
    markDirty(s, 'a');
    expect(shouldFlush(s, 1000)).toBe(true);
  });

  it('batch size forces flush', () => {
    const s = make();
    for (let i = 0; i < 5; i++) markDirty(s, `k${i}`);
    expect(shouldFlush(s, 100)).toBe(true);
  });

  it('drain clears dirty', () => {
    const s = make();
    markDirty(s, 'a');
    markDirty(s, 'b');
    expect(drainBatch(s, 1000)).toHaveLength(2);
    expect(s.dirtySet.size).toBe(0);
  });

  it('dedup on key', () => {
    const s = make();
    markDirty(s, 'x');
    markDirty(s, 'x');
    expect(s.dirtySet.size).toBe(1);
  });
});
