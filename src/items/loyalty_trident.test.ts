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

  it('eta infinite at level 0', () => {
    expect(eta({ level: 0, throwerAlive: true, distanceToThrower: 10 })).toBe(Infinity);
  });

  it('incompat riptide', () => {
    expect(incompatibleWithRiptide()).toBe(true);
  });
});
