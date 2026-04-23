import { describe, it, expect } from 'vitest';
import {
  absorbsNearby,
  becomesWetAfterAbsorb,
  maxAbsorbed,
  ABSORB_RADIUS,
  MAX_WATER_BLOCKS,
} from './sponge_absorb_radius';

describe('sponge absorb radius', () => {
  it('in range', () => {
    expect(absorbsNearby(ABSORB_RADIUS)).toBe(true);
  });

  it('out of range', () => {
    expect(absorbsNearby(ABSORB_RADIUS + 1)).toBe(false);
  });

  it('becomes wet', () => {
    expect(becomesWetAfterAbsorb()).toBe(true);
  });

  it('has max absorb', () => {
    expect(maxAbsorbed()).toBe(MAX_WATER_BLOCKS);
  });
});
