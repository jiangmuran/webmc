import { describe, it, expect } from 'vitest';
import { tickBreath, tickSwim } from './swim_physics';

const BASE = {
  velocity: { x: 0, y: 0, z: 0 },
  inWater: true,
  headInWater: true,
  sneaking: false,
  depthStriderLevel: 0,
  dolphinsGrace: false,
  sprinting: false,
};

describe('swim', () => {
  it('land = no change', () => {
    const r = tickSwim({ ...BASE, inWater: false }, 1, 0);
    expect(r.pose).toBe('standing');
    expect(r.velocity).toEqual({ x: 0, y: 0, z: 0 });
  });

  it('swim with sprint + head in water = swimming pose', () => {
    const r = tickSwim({ ...BASE, sprinting: true }, 1, 0);
    expect(r.pose).toBe('swimming');
  });

  it('buoyancy lifts the player up', () => {
    const r = tickSwim(BASE, 0, 0);
    expect(r.velocity.y).toBeGreaterThan(0);
  });

  it('sneak sinks slowly', () => {
    const r = tickSwim({ ...BASE, sneaking: true }, 0, 0);
    expect(r.velocity.y).toBeLessThan(0.04);
  });

  it('dolphin grace amplifies forward input', () => {
    const base = tickSwim(BASE, 1, 0);
    const dolphin = tickSwim({ ...BASE, dolphinsGrace: true }, 1, 0);
    expect(Math.abs(dolphin.velocity.z)).toBeGreaterThan(Math.abs(base.velocity.z));
  });
});

describe('breath', () => {
  it('fills while on land', () => {
    const r = tickBreath(
      {
        headInWater: false,
        respirationLevel: 0,
        hasWaterBreathing: false,
        hasConduitPower: false,
        breathSec: 5,
      },
      1,
    );
    expect(r.breathSec).toBeGreaterThan(5);
  });

  it('drains underwater', () => {
    const r = tickBreath(
      {
        headInWater: true,
        respirationLevel: 0,
        hasWaterBreathing: false,
        hasConduitPower: false,
        breathSec: 10,
      },
      1,
    );
    expect(r.breathSec).toBe(9);
  });

  it('water breathing cancels drowning', () => {
    const r = tickBreath(
      {
        headInWater: true,
        respirationLevel: 0,
        hasWaterBreathing: true,
        hasConduitPower: false,
        breathSec: 5,
      },
      1,
    );
    expect(r.drownDamage).toBe(0);
  });

  it('no air = drown damage', () => {
    const r = tickBreath(
      {
        headInWater: true,
        respirationLevel: 0,
        hasWaterBreathing: false,
        hasConduitPower: false,
        breathSec: 0.1,
      },
      1,
    );
    expect(r.drownDamage).toBeGreaterThan(0);
  });
});
