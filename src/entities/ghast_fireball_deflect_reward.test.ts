import { describe, it, expect } from 'vitest';
import {
  grantsAdvancement,
  returnsToOriginDirection,
  shootInterval,
  GHAST_SHOOT_INTERVAL_MIN,
  GHAST_SHOOT_INTERVAL_MAX,
} from './ghast_fireball_deflect_reward';

describe('ghast fireball deflect reward', () => {
  it('ghast kill by reflect grants advancement', () => {
    expect(
      grantsAdvancement({
        victimIsGhast: true,
        deflectedByPlayer: true,
        deflectedBySword: false,
      }),
    ).toBe(true);
  });

  it('non-ghast victim no award', () => {
    expect(
      grantsAdvancement({
        victimIsGhast: false,
        deflectedByPlayer: true,
        deflectedBySword: false,
      }),
    ).toBe(false);
  });

  it('not player-deflected no award', () => {
    expect(
      grantsAdvancement({
        victimIsGhast: true,
        deflectedByPlayer: false,
        deflectedBySword: false,
      }),
    ).toBe(false);
  });

  it('deflected fireball rebounds', () => {
    expect(returnsToOriginDirection(true)).toBe(true);
  });

  it('shoot interval bounded', () => {
    const i = shootInterval(() => 0.5);
    expect(i).toBeGreaterThanOrEqual(GHAST_SHOOT_INTERVAL_MIN);
    expect(i).toBeLessThan(GHAST_SHOOT_INTERVAL_MAX);
  });
});
