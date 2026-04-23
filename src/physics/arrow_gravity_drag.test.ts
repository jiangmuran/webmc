import { describe, it, expect } from 'vitest';
import { applyArrowTick, speed, AIR_DRAG, WATER_DRAG } from './arrow_gravity_drag';

describe('arrow gravity drag', () => {
  it('vy decreases each tick', () => {
    const a = applyArrowTick({ vx: 0, vy: 0, vz: 0, inWater: false });
    expect(a.vy).toBeLessThan(0);
  });

  it('water drag heavier', () => {
    expect(WATER_DRAG).toBeLessThan(AIR_DRAG);
  });

  it('water slows faster', () => {
    const dry = applyArrowTick({ vx: 1, vy: 0, vz: 0, inWater: false });
    const wet = applyArrowTick({ vx: 1, vy: 0, vz: 0, inWater: true });
    expect(wet.vx).toBeLessThan(dry.vx);
  });

  it('speed magnitude', () => {
    expect(speed({ vx: 3, vy: 4, vz: 0, inWater: false })).toBe(5);
  });

  it('tick preserves water flag', () => {
    expect(applyArrowTick({ vx: 0, vy: 0, vz: 0, inWater: true }).inWater).toBe(true);
  });
});
