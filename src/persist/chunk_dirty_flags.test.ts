import { describe, it, expect } from 'vitest';
import { createTracker, markDirty, isDirty, drainDirtyChunks } from './chunk_dirty_flags';

describe('chunk dirty flags', () => {
  it('starts clean', () => {
    expect(isDirty(createTracker(), 0, 0, 'blocks')).toBe(false);
  });

  it('mark records flag', () => {
    const t = createTracker();
    markDirty(t, 5, 3, 'lighting');
    expect(isDirty(t, 5, 3, 'lighting')).toBe(true);
  });

  it('multiple flags stack', () => {
    const t = createTracker();
    markDirty(t, 0, 0, 'blocks');
    markDirty(t, 0, 0, 'lighting');
    expect(isDirty(t, 0, 0, 'blocks')).toBe(true);
    expect(isDirty(t, 0, 0, 'lighting')).toBe(true);
  });

  it('drain clears', () => {
    const t = createTracker();
    markDirty(t, 1, 2, 'entities');
    const drained = drainDirtyChunks(t);
    expect(drained).toHaveLength(1);
    expect(drainDirtyChunks(t)).toHaveLength(0);
  });

  it('different chunk independent', () => {
    const t = createTracker();
    markDirty(t, 0, 0, 'blocks');
    expect(isDirty(t, 1, 0, 'blocks')).toBe(false);
  });
});
