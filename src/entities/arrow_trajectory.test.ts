import { describe, it, expect } from 'vitest';
import { fireArrow, tickArrow, speed, damageFor, GRAVITY } from './arrow_trajectory';

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

  it('in-ground freezes', () => {
    const a = fireArrow({ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, 1);
    a.inGround = true;
    const x0 = a.x;
    tickArrow(a);
    expect(a.x).toBe(x0);
  });
});
