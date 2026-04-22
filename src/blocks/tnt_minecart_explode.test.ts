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

  it('explosion power scales', () => {
    expect(explosionPower(0)).toBe(EXPLOSION_POWER_BASE);
    expect(explosionPower(5)).toBe(8);
  });
});
