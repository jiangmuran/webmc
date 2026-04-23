import { describe, it, expect } from 'vitest';
import { makeTracker, markDirty, shouldFlush, flush, pendingCount } from './chunk_dirty_tracker';

describe('chunk dirty tracker', () => {
  it('tracks dirty keys', () => {
    const t = makeTracker();
    markDirty(t, '0,0');
    expect(pendingCount(t)).toBe(1);
  });

  it('dedup', () => {
    const t = makeTracker();
    markDirty(t, '0,0');
    markDirty(t, '0,0');
    expect(pendingCount(t)).toBe(1);
  });

  it('shouldFlush after interval', () => {
    const t = makeTracker(1000);
    markDirty(t, 'a');
    expect(shouldFlush(t, 500)).toBe(false);
    expect(shouldFlush(t, 2000)).toBe(true);
  });

  it('no flush when empty', () => {
    expect(shouldFlush(makeTracker(0), 100000)).toBe(false);
  });

  it('flush clears', () => {
    const t = makeTracker();
    markDirty(t, 'a');
    markDirty(t, 'b');
    const keys = flush(t, 1000);
    expect(keys.length).toBe(2);
    expect(pendingCount(t)).toBe(0);
  });
});
