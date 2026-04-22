import { describe, it, expect } from 'vitest';
import {
  arrowsOnFire,
  ignitionTicksOnHit,
  compatibleWithInfinity,
  compatibleWithPower,
  FLAME_FIRE_TICKS,
} from './flame_bow';

describe('flame bow', () => {
  it('ignites when enchanted', () => {
    expect(arrowsOnFire(true)).toBe(true);
    expect(arrowsOnFire(false)).toBe(false);
  });

  it('burn duration 5s', () => {
    expect(ignitionTicksOnHit(true)).toBe(FLAME_FIRE_TICKS);
    expect(FLAME_FIRE_TICKS).toBe(100);
  });

  it('no burn without enchant', () => {
    expect(ignitionTicksOnHit(false)).toBe(0);
  });

  it('works with infinity', () => {
    expect(compatibleWithInfinity()).toBe(true);
  });

  it('works with power', () => {
    expect(compatibleWithPower()).toBe(true);
  });
});
