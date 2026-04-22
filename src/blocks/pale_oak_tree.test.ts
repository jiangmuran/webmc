import { describe, it, expect } from 'vitest';
import {
  canGrow,
  trunkHeight,
  heartsPerTree,
  PALE_OAK_TRUNK_MIN,
  PALE_OAK_TRUNK_MAX,
} from './pale_oak_tree';

describe('pale oak tree', () => {
  it('needs space', () => {
    expect(canGrow({ hasSaplingSpace: false, lightLevel: 15, randomTicksSinceBonemeal: 0 })).toBe(
      false,
    );
  });

  it('needs light', () => {
    expect(canGrow({ hasSaplingSpace: true, lightLevel: 4, randomTicksSinceBonemeal: 0 })).toBe(
      false,
    );
  });

  it('grows when ok', () => {
    expect(canGrow({ hasSaplingSpace: true, lightLevel: 12, randomTicksSinceBonemeal: 0 })).toBe(
      true,
    );
  });

  it('trunk height in range', () => {
    for (let i = 0; i < 100; i++) {
      const h = trunkHeight(Math.random);
      expect(h).toBeGreaterThanOrEqual(PALE_OAK_TRUNK_MIN);
      expect(h).toBeLessThanOrEqual(PALE_OAK_TRUNK_MAX);
    }
  });

  it('hearts per tree floor(trunk/4) min 1', () => {
    expect(heartsPerTree(6)).toBe(1);
    expect(heartsPerTree(8)).toBe(2);
    expect(heartsPerTree(13)).toBe(3);
  });
});
