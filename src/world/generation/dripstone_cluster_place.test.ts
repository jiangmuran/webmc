import { describe, it, expect } from 'vitest';
import {
  clusterHeight,
  tipFirstTier,
  waterDripChance,
  formsFromDrippingLava,
} from './dripstone_cluster_place';

describe('dripstone cluster place', () => {
  it('height 2-6', () => {
    const h = clusterHeight({ attach: 'ceiling', rng: () => 0.5 });
    expect(h).toBeGreaterThanOrEqual(2);
    expect(h).toBeLessThanOrEqual(6);
  });

  it('first piece is tip', () => {
    expect(tipFirstTier(4)[0]).toBe('tip');
  });

  it('last piece is base', () => {
    const t = tipFirstTier(4);
    expect(t[t.length - 1]).toBe('base');
  });

  it('ceiling + water drips', () => {
    expect(waterDripChance({ attach: 'ceiling', rng: () => 0 }, true)).toBeGreaterThan(0);
  });

  it("floor doesn't drip", () => {
    expect(waterDripChance({ attach: 'floor', rng: () => 0 }, true)).toBe(0);
  });

  it('lava drip forms dripstone', () => {
    expect(formsFromDrippingLava(false, true)).toBe('pointed_dripstone');
  });

  it('nothing above nothing forms', () => {
    expect(formsFromDrippingLava(false, false)).toBeUndefined();
  });
});
