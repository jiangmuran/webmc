import { describe, it, expect } from 'vitest';
import { tryIgnite, inRange, rainSuppresses, LAVA_FIRE_RADIUS } from './lava_fire_surround';

describe('lava fire surround', () => {
  it('out of range nothing', () => {
    expect(
      tryIgnite({
        withinRange: false,
        flammableEncouragement: 100,
        adjacentAir: true,
        rand: () => 0,
      }),
    ).toBe(false);
  });

  it('no air nothing', () => {
    expect(
      tryIgnite({
        withinRange: true,
        flammableEncouragement: 100,
        adjacentAir: false,
        rand: () => 0,
      }),
    ).toBe(false);
  });

  it('high encouragement ignites', () => {
    expect(
      tryIgnite({
        withinRange: true,
        flammableEncouragement: 60,
        adjacentAir: true,
        rand: () => 0,
      }),
    ).toBe(true);
  });

  it('low encouragement skips', () => {
    expect(
      tryIgnite({
        withinRange: true,
        flammableEncouragement: 5,
        adjacentAir: true,
        rand: () => 0.9,
      }),
    ).toBe(false);
  });

  it('in range check', () => {
    expect(inRange(1)).toBe(true);
    expect(inRange(LAVA_FIRE_RADIUS + 1)).toBe(false);
  });

  it('rain suppresses', () => {
    expect(rainSuppresses()).toBe(true);
  });
});
