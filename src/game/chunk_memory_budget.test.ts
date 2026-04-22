import { describe, it, expect } from 'vitest';
import { ChunkMemoryTracker } from './chunk_memory_budget';

describe('chunk memory', () => {
  it('under budget no evictions', () => {
    const t = new ChunkMemoryTracker(1000);
    t.track({ cx: 0, cz: 0, bytes: 300, priority: 1 });
    expect(t.evictionCandidates()).toEqual([]);
  });

  it('over budget evicts low priority first', () => {
    const t = new ChunkMemoryTracker(1000);
    t.track({ cx: 0, cz: 0, bytes: 500, priority: 10 });
    t.track({ cx: 1, cz: 0, bytes: 400, priority: 1 });
    t.track({ cx: 2, cz: 0, bytes: 300, priority: 5 });
    const e = t.evictionCandidates();
    expect(e[0]?.priority).toBe(1);
  });

  it('untrack', () => {
    const t = new ChunkMemoryTracker(1000);
    t.track({ cx: 0, cz: 0, bytes: 2000, priority: 1 });
    t.untrack(0, 0);
    expect(t.totalBytes()).toBe(0);
  });

  it('multiple evictions', () => {
    const t = new ChunkMemoryTracker(100);
    t.track({ cx: 0, cz: 0, bytes: 50, priority: 1 });
    t.track({ cx: 1, cz: 0, bytes: 50, priority: 2 });
    t.track({ cx: 2, cz: 0, bytes: 50, priority: 3 });
    const e = t.evictionCandidates();
    expect(e.length).toBeGreaterThanOrEqual(1);
  });
});
