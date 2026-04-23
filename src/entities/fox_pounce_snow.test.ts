import { describe, it, expect } from 'vitest';
import { canPounce, launchVelocity } from './fox_pounce_snow';

describe('fox pounce snow', () => {
  it('pounces at close', () => {
    expect(canPounce({ targetBelowSnow: true, distanceToTarget: 2 })).toBe(true);
  });

  it('no pounce if not in snow', () => {
    expect(canPounce({ targetBelowSnow: false, distanceToTarget: 2 })).toBe(false);
  });

  it('far no pounce', () => {
    expect(canPounce({ targetBelowSnow: true, distanceToTarget: 20 })).toBe(false);
  });

  it('velocity up and forward', () => {
    const v = launchVelocity({ targetBelowSnow: true, distanceToTarget: 2 });
    expect(v.vy).toBeGreaterThan(0);
    expect(v.vz).toBeGreaterThan(0);
  });
});
