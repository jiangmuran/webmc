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

  it('spawn only dark + low', () => {
    expect(canSpawnBat({ lightLevel: 2, y: 20 })).toBe(true);
    expect(canSpawnBat({ lightLevel: 10, y: 20 })).toBe(false);
    expect(canSpawnBat({ lightLevel: 2, y: 80 })).toBe(false);
  });
});
