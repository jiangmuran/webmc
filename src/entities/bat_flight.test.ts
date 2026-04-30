import { describe, it, expect } from 'vitest';
import { makeBat, tickBat, canSpawnBat, MAX_HP } from './bat_flight';

describe('bat', () => {
  it('max hp 6', () => {
    expect(makeBat().hp).toBe(MAX_HP);
  });

  it('day sleep on ceiling', () => {
    const b = makeBat();
    tickBat(b, { isDay: true, ceilingAbove: true, playerNearby: false });
    expect(b.sleepingOnCeiling).toBe(true);
  });

  it('player wakes', () => {
    const b = makeBat();
    tickBat(b, { isDay: true, ceilingAbove: true, playerNearby: true });
    expect(b.flying).toBe(true);
  });

  it('night flies', () => {
    const b = makeBat();
    tickBat(b, { isDay: false, ceilingAbove: true, playerNearby: false });
    expect(b.flying).toBe(true);
  });

  it('spawn requires light ≤ 3 (wiki: any y-level since 1.21.2)', () => {
    expect(canSpawnBat({ lightLevel: 2 })).toBe(true);
    expect(canSpawnBat({ lightLevel: 3 })).toBe(true);
    expect(canSpawnBat({ lightLevel: 4 })).toBe(false);
    expect(canSpawnBat({ lightLevel: 10 })).toBe(false);
  });

  it('spawn allowed at high y (wiki: any y-level)', () => {
    expect(canSpawnBat({ lightLevel: 2 })).toBe(true);
  });

  it('spawn blocked when sky-exposed', () => {
    expect(canSpawnBat({ lightLevel: 2, exposedToSky: true })).toBe(false);
    expect(canSpawnBat({ lightLevel: 2, exposedToSky: false })).toBe(true);
  });
});
