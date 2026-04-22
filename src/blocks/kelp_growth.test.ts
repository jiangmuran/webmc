import { describe, it, expect } from 'vitest';
import { boneMealKelp, makeKelp, tickKelp } from './kelp_growth';

describe('kelp growth', () => {
  it('grows tip each tick when water', () => {
    const k = makeKelp(60);
    const r = tickKelp({ x: 0, z: 0 }, k, { isWater: () => true }, () => 0.01);
    expect(r.grew).toBe(true);
    expect(k.length).toBe(2);
  });

  it('stops at max length', () => {
    const k = makeKelp(60);
    k.length = 26;
    const r = tickKelp({ x: 0, z: 0 }, k, { isWater: () => true }, () => 0.01);
    expect(r.grew).toBe(false);
  });

  it('refuses non-water', () => {
    const k = makeKelp(60);
    const r = tickKelp({ x: 0, z: 0 }, k, { isWater: () => false }, () => 0.01);
    expect(r.grew).toBe(false);
  });

  it('bone meal adds 1-2 segments', () => {
    const k = makeKelp(60);
    const placements = boneMealKelp({ x: 0, z: 0 }, k, { isWater: () => true }, () => 0.5);
    expect(placements.length).toBeGreaterThanOrEqual(1);
    expect(placements.length).toBeLessThanOrEqual(2);
  });
});
