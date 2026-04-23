import { describe, it, expect } from 'vitest';
import { initBob, accumulate, offsetY, offsetX, setStrength } from './walk_bob';

describe('walk bob', () => {
  it('zero bob at start', () => {
    expect(offsetY(initBob())).toBeCloseTo(0);
  });

  it('accumulate only on ground', () => {
    let s = initBob();
    s = accumulate(s, 1, 0, false);
    expect(s.distanceWalked).toBe(0);
    s = accumulate(s, 1, 0, true);
    expect(s.distanceWalked).toBe(1);
  });

  it('offset oscillates', () => {
    let s = initBob();
    s = { ...s, distanceWalked: 0.5 };
    expect(offsetY(s)).toBeGreaterThan(0);
  });

  it('strength scales', () => {
    const low = setStrength(initBob(), 0);
    expect(offsetY({ ...low, distanceWalked: 0.5 })).toBe(0);
  });

  it('setStrength clamps', () => {
    expect(setStrength(initBob(), 10).strength).toBe(1);
    expect(setStrength(initBob(), -1).strength).toBe(0);
  });

  it('offsetX negative possible', () => {
    const s = { distanceWalked: 1.5, strength: 1 };
    expect(offsetX(s)).toBeLessThan(0);
  });
});
