import { describe, it, expect } from 'vitest';
import {
  tierFromMaterialCount,
  rangeBlocks,
  canGiveSecondary,
  durationTicks,
} from './beacon_effect_pyramid';

describe('beacon effect pyramid', () => {
  it('tier rises with count', () => {
    expect(tierFromMaterialCount(0)).toBe(0);
    expect(tierFromMaterialCount(9)).toBe(1);
    expect(tierFromMaterialCount(200)).toBe(4);
  });

  it('range grows with tier', () => {
    expect(rangeBlocks(4)).toBeGreaterThan(rangeBlocks(1));
  });

  it('tier 4 unlocks secondary', () => {
    expect(canGiveSecondary(4)).toBe(true);
    expect(canGiveSecondary(2)).toBe(false);
  });

  it('duration scales', () => {
    expect(durationTicks(4)).toBeGreaterThan(durationTicks(0));
  });
});
