import { describe, it, expect } from 'vitest';
import { distanceOutside, damagePerTick } from './world_border_rules';

const b = {
  centerX: 0,
  centerZ: 0,
  sizeBlocks: 100,
  damagePerBlock: 0.2,
  damageBuffer: 5,
};

describe('world border rules', () => {
  it('inside safe', () => {
    expect(distanceOutside(b, 10, 10)).toBe(0);
  });

  it('outside distance positive', () => {
    expect(distanceOutside(b, 100, 0)).toBeGreaterThan(0);
  });

  it('damage inside buffer 0', () => {
    expect(damagePerTick(b, 52, 0)).toBe(0);
  });

  it('past buffer damages', () => {
    expect(damagePerTick(b, 100, 0)).toBeGreaterThan(0);
  });
});
