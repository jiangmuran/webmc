import { describe, it, expect } from 'vitest';
import {
  returnSpeedBlocksPerTick,
  shouldReturn,
  incompatibleWithRiptide,
  eta,
} from './loyalty_trident';

describe('loyalty trident', () => {
  it('no level no return', () => {
    expect(shouldReturn({ level: 0, throwerAlive: true, distanceToThrower: 5 })).toBe(false);
  });

  it('dead thrower no return', () => {
    expect(shouldReturn({ level: 3, throwerAlive: false, distanceToThrower: 5 })).toBe(false);
  });

  it('returns when alive', () => {
    expect(shouldReturn({ level: 2, throwerAlive: true, distanceToThrower: 5 })).toBe(true);
  });

  it('speed scales', () => {
    expect(returnSpeedBlocksPerTick(3)).toBeGreaterThan(returnSpeedBlocksPerTick(1));
  });

  it('speed matches wiki canon (~0.83/1.67/2.5 b/t at L1/L2/L3)', () => {
    // Wiki (minecraft.wiki/w/Loyalty): "Travels at ~0.83 b/t at L1,
    // ~1.67 b/t at L2, and 2.5 b/t at L3." Old `0.05 × level` gave
    // 0.05 / 0.10 / 0.15 — about 1/16 of canon, making Loyalty III
    // tridents take ~17× as long to fly back.
    expect(returnSpeedBlocksPerTick(1)).toBeCloseTo(0.833, 2);
    expect(returnSpeedBlocksPerTick(2)).toBeCloseTo(1.667, 2);
    expect(returnSpeedBlocksPerTick(3)).toBeCloseTo(2.5, 2);
  });

  it('eta infinite at level 0', () => {
    expect(eta({ level: 0, throwerAlive: true, distanceToThrower: 10 })).toBe(Infinity);
  });

  it('incompat riptide', () => {
    expect(incompatibleWithRiptide()).toBe(true);
  });
});
