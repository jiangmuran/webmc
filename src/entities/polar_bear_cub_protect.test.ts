import { describe, it, expect } from 'vitest';
import { isHostile, cubDefendRange } from './polar_bear_cub_protect';

describe('polar bear cub protect', () => {
  it('cub not hostile', () => {
    expect(isHostile({ hasCubNearby: true, isAdult: false, playerDamagedIt: false })).toBe(false);
  });

  it('adult near cub hostile', () => {
    expect(isHostile({ hasCubNearby: true, isAdult: true, playerDamagedIt: false })).toBe(true);
  });

  it('attacker provoked', () => {
    expect(isHostile({ hasCubNearby: false, isAdult: true, playerDamagedIt: true })).toBe(true);
  });

  it('lone adult neutral', () => {
    expect(isHostile({ hasCubNearby: false, isAdult: true, playerDamagedIt: false })).toBe(false);
  });

  it('defend range positive', () => {
    expect(cubDefendRange()).toBeGreaterThan(0);
  });
});
