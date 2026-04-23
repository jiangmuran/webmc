import { describe, it, expect } from 'vitest';
import { knockbackVelocity, knockbackY, applyResistance } from './knockback_velocity';

describe('knockback velocity', () => {
  it('pushes along attacker→target', () => {
    const v = knockbackVelocity({ x: 0, z: 0 }, { x: 5, z: 0 }, 1);
    expect(v.x).toBeCloseTo(1);
    expect(v.z).toBeCloseTo(0);
  });

  it('zero strength no push', () => {
    const v = knockbackVelocity({ x: 0, z: 0 }, { x: 5, z: 0 }, 0);
    expect(v.x).toBe(0);
  });

  it('vertical boost on push', () => {
    expect(knockbackY(1)).toBeGreaterThan(0);
    expect(knockbackY(0)).toBe(0);
  });

  it('resistance reduces', () => {
    const v = applyResistance({ x: 10, z: 0 }, 0.5);
    expect(v.x).toBeCloseTo(5);
  });

  it('full resistance nulls', () => {
    expect(applyResistance({ x: 10, z: 0 }, 1)).toEqual({ x: 0, z: 0 });
  });
});
