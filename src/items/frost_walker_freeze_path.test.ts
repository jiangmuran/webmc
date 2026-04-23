import { describe, it, expect } from 'vitest';
import { radius, freezesBlock, resultingBlock, RADIUS_BASE } from './frost_walker_freeze_path';

describe('frost walker freeze path', () => {
  it('level 0 min radius', () => {
    expect(radius(0)).toBe(RADIUS_BASE);
  });

  it('level scales radius', () => {
    expect(radius(2)).toBeGreaterThan(radius(0));
  });

  it('freezes source water', () => {
    expect(
      freezesBlock({ level: 1, belowBlock: 'water', blockIsWaterSource: true }),
    ).toBe(true);
  });

  it('no level no freeze', () => {
    expect(
      freezesBlock({ level: 0, belowBlock: 'water', blockIsWaterSource: true }),
    ).toBe(false);
  });

  it('result frosted ice', () => {
    expect(
      resultingBlock({ level: 1, belowBlock: 'water', blockIsWaterSource: true }),
    ).toBe('frosted_ice');
  });
});
