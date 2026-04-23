import { describe, it, expect } from 'vitest';
import { canFreezeHere, radiusAt, iceMeltAgeTicks, incompatibleWith } from './frost_walker_ice';

describe('frost walker ice', () => {
  it('no level no freeze', () => {
    expect(canFreezeHere({ level: 0, waterDepthBelow: 1 })).toBe(false);
  });

  it('freezes surface water', () => {
    expect(canFreezeHere({ level: 1, waterDepthBelow: 1 })).toBe(true);
  });

  it('deep water no freeze', () => {
    expect(canFreezeHere({ level: 1, waterDepthBelow: 3 })).toBe(false);
  });

  it('radius scales', () => {
    expect(radiusAt(2)).toBeGreaterThan(radiusAt(1));
  });

  it('ice melts eventually', () => {
    expect(iceMeltAgeTicks()).toBeGreaterThan(0);
  });

  it('incompat depth strider', () => {
    expect(incompatibleWith()).toContain('depth_strider');
  });
});
