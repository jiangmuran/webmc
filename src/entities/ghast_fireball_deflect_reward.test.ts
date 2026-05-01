import { describe, it, expect } from 'vitest';
import {
  grantsAdvancement,
  returnsToOriginDirection,
  shootInterval,
  GHAST_SHOOT_INTERVAL_TICKS,
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

  it('shoot interval is exactly 3s per wiki', () => {
    expect(GHAST_SHOOT_INTERVAL_TICKS).toBe(60);
    expect(shootInterval(() => 0.0)).toBe(60);
    expect(shootInterval(() => 0.999)).toBe(60);
  });
});
