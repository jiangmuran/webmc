import { describe, it, expect } from 'vitest';
import { rollTree, leafAt, MIN_HEIGHT, MAX_HEIGHT } from './tree_oak';

describe('oak tree', () => {
  it('height in range', () => {
    for (let i = 0; i < 10; i++) {
      const t = rollTree(() => 0.5);
      expect(t.trunkHeight).toBeGreaterThanOrEqual(MIN_HEIGHT);
      expect(t.trunkHeight).toBeLessThanOrEqual(MAX_HEIGHT);
    }
  });

  it('leaf at trunk top spans', () => {
    const t = rollTree(() => 0.5);
    expect(leafAt(0, t.trunkHeight, 0, t)).toBe(true);
  });

  it('no leaf below trunk', () => {
    const t = rollTree(() => 0.5);
    expect(leafAt(0, 0, 0, t)).toBe(false);
  });

  it('thin at top', () => {
    const t = rollTree(() => 0.5);
    expect(leafAt(3, t.trunkHeight + 1, 3, t)).toBe(false);
    expect(leafAt(1, t.trunkHeight + 1, 0, t)).toBe(true);
  });
});
