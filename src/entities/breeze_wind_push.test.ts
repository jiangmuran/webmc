import { describe, it, expect } from 'vitest';
import { knockbackVelocity, damageDealt, WIND_CHARGE_RADIUS } from './breeze_wind_push';

const impact = { impactX: 0, impactY: 0, impactZ: 0 };

describe('breeze wind push', () => {
  it('far target no knockback', () => {
    const r = knockbackVelocity(impact, { x: 10, y: 0, z: 0 });
    expect(r.vx).toBe(0);
  });

  it('close target pushed', () => {
    const r = knockbackVelocity(impact, { x: 1, y: 0, z: 0 });
    expect(r.vx).toBeGreaterThan(0);
  });

  it('at center no direction', () => {
    const r = knockbackVelocity(impact, { x: 0, y: 0, z: 0 });
    expect(r.vx).toBe(0);
    expect(r.vy).toBe(0);
  });

  it('no damage', () => {
    expect(damageDealt()).toBe(0);
  });

  it('radius constant', () => {
    expect(WIND_CHARGE_RADIUS).toBeGreaterThan(0);
  });
});
