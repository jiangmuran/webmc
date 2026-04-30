import { describe, it, expect } from 'vitest';
import {
  makeTntMinecart,
  ignite,
  onActivate,
  tickTnt,
  explosionPower,
  NORMAL_FUSE,
  SHORT_FUSE,
  EXPLOSION_POWER_BASE,
} from './tnt_minecart_explode';

describe('tnt minecart', () => {
  it('ignite sets fuse', () => {
    const c = makeTntMinecart();
    ignite(c);
    expect(c.fuseTicks).toBe(NORMAL_FUSE);
  });

  it('powered rail activates', () => {
    const c = makeTntMinecart();
    expect(
      onActivate(c, {
        poweredRailBelow: true,
        crashedAtSpeed: 0,
        hitByArrowOnFire: false,
      }),
    ).toBe(true);
    expect(c.fuseTicks).toBe(NORMAL_FUSE);
  });

  it('high-speed crash short fuse', () => {
    const c = makeTntMinecart();
    onActivate(c, {
      poweredRailBelow: false,
      crashedAtSpeed: 1,
      hitByArrowOnFire: false,
    });
    expect(c.fuseTicks).toBe(SHORT_FUSE);
  });

  it('tick to explosion', () => {
    const c = makeTntMinecart();
    ignite(c, 2);
    tickTnt(c);
    expect(tickTnt(c)).toBe('exploded');
  });

  it('idle without fuse', () => {
    expect(tickTnt(makeTntMinecart())).toBe('idle');
  });

  it('explosion power scales (wiki: 4 + random(0, min(7.5, 1.5 × velocity)))', () => {
    // Velocity 0 → no bonus
    expect(explosionPower(0, () => 0.5)).toBe(EXPLOSION_POWER_BASE);
    // Velocity 1 with min roll → base only; max roll → +1.5
    expect(explosionPower(1, () => 0)).toBe(EXPLOSION_POWER_BASE);
    expect(explosionPower(1, () => 0.999)).toBeCloseTo(EXPLOSION_POWER_BASE + 1.5, 1);
    // Velocity 5 with max roll → 4 + 7.5 = 11.5 (wiki ceiling)
    expect(explosionPower(5, () => 0.999)).toBeCloseTo(11.5, 1);
    // Velocity 100 capped at +7.5 bonus (1.5 × 100 capped to 7.5)
    expect(explosionPower(100, () => 0.999)).toBeCloseTo(11.5, 1);
  });
});
