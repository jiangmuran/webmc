import { describe, it, expect } from 'vitest';
import { fireArrow, tickArrow, speed, damageFor, GRAVITY, type Arrow } from './arrow_trajectory';

describe('arrow', () => {
  it('draw affects speed', () => {
    const a = fireArrow({ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, 1);
    expect(speed(a)).toBeCloseTo(3);
  });

  it('critical on full draw', () => {
    const a = fireArrow({ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, 1);
    expect(a.critical).toBe(true);
    const b = fireArrow({ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, 0.5);
    expect(b.critical).toBe(false);
  });

  it('gravity applies over ticks', () => {
    const a = fireArrow({ x: 0, y: 100, z: 0 }, { x: 1, y: 0, z: 0 }, 1);
    const startVy = a.vy;
    tickArrow(a);
    expect(a.vy).toBeLessThan(startVy);
    expect(Math.abs(a.vy - (startVy * 0.99 - GRAVITY))).toBeLessThan(0.001);
  });

  it('damage scales with power enchant', () => {
    const a = fireArrow({ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, 0.5);
    const base = damageFor({ ...a, critical: false }, 0);
    const with5 = damageFor({ ...a, critical: false }, 5);
    expect(with5).toBeGreaterThan(base);
  });

  it('Power V at full draw deals 15 (wiki: 6 + 150% = 15)', () => {
    const a = fireArrow({ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, 1);
    expect(damageFor({ ...a, critical: false }, 5)).toBe(15);
  });

  it('Power III at full draw deals 12 (wiki: 6 + 100% = 12)', () => {
    const a = fireArrow({ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, 1);
    expect(damageFor({ ...a, critical: false }, 3)).toBe(12);
  });

  it('Power bonus rounds UP to half-heart (wiki)', () => {
    // base=5, Power IV: 5 × 0.25 × 5 = 6.25 → ceil → 7 → total 12.
    // Round-to-nearest would give 11, under wiki canon by 1 HP.
    const a: Arrow = {
      x: 0,
      y: 0,
      z: 0,
      vx: 2.5,
      vy: 0,
      vz: 0,
      inGround: false,
      critical: false,
    };
    expect(damageFor(a, 4)).toBe(12);
  });

  it('in-ground freezes', () => {
    const a = fireArrow({ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, 1);
    a.inGround = true;
    const x0 = a.x;
    tickArrow(a);
    expect(a.x).toBe(x0);
  });
});
