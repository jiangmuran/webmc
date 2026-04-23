import { describe, it, expect } from 'vitest';
import { step } from './arrow_drag_gravity';

describe('arrow drag gravity', () => {
  it('drags in air', () => {
    const a = step({ vx: 10, vy: 0, vz: 0, inWater: false });
    expect(a.vx).toBeLessThan(10);
  });

  it('gravity pulls down', () => {
    expect(step({ vx: 0, vy: 0, vz: 0, inWater: false }).vy).toBeLessThan(0);
  });

  it('water drags more', () => {
    const air = step({ vx: 10, vy: 0, vz: 0, inWater: false });
    const water = step({ vx: 10, vy: 0, vz: 0, inWater: true });
    expect(water.vx).toBeLessThan(air.vx);
  });
});
