import { describe, it, expect } from 'vitest';
import { tick, extinguishInRain, infiniteFuelBlock, FIRE_MAX_AGE } from './fire_burnout_age';

describe('fire burnout age', () => {
  it('infinite fuel never ages', () => {
    const f = { age: FIRE_MAX_AGE, onInfiniteFuel: true };
    expect(tick(f, false, () => 1)).toBe(f);
  });

  it('age advances', () => {
    const r = tick({ age: 5, onInfiniteFuel: false }, true, () => 0.5);
    expect(r).not.toBeNull();
    if (r) expect(r.age).toBeGreaterThanOrEqual(5);
  });

  it('extinguishes when old + no fuel', () => {
    const r = tick({ age: FIRE_MAX_AGE, onInfiniteFuel: false }, false, () => 1);
    expect(r).toBeNull();
  });

  it('rain extinguishes normal fire', () => {
    expect(extinguishInRain(true, false)).toBe(true);
  });

  it('rain leaves eternal fire', () => {
    expect(extinguishInRain(true, true)).toBe(false);
  });

  it('netherrack eternal', () => {
    expect(infiniteFuelBlock('netherrack')).toBe(true);
    expect(infiniteFuelBlock('stone')).toBe(false);
  });
});
