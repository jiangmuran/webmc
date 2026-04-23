import { describe, it, expect } from 'vitest';
import { stepVY, horizontalSpeedMult, canElytraSwim } from './swim_buoyancy';

const base = {
  inWater: true,
  swimUp: false,
  swimDown: false,
  depthStrider: 0,
  dolphinsGrace: false,
  elytraSwimming: false,
};

describe('swim buoyancy', () => {
  it('out of water ignores', () => {
    expect(stepVY(5, { ...base, inWater: false })).toBe(5);
  });

  it('swim up increases vy', () => {
    expect(stepVY(0, { ...base, swimUp: true })).toBeGreaterThan(stepVY(0, base));
  });

  it('swim down decreases vy', () => {
    expect(stepVY(0, { ...base, swimDown: true })).toBeLessThan(stepVY(0, base));
  });

  it('depth strider faster', () => {
    expect(horizontalSpeedMult({ ...base, depthStrider: 3 })).toBeGreaterThan(
      horizontalSpeedMult(base),
    );
  });

  it('dolphins grace boost', () => {
    expect(horizontalSpeedMult({ ...base, dolphinsGrace: true })).toBeGreaterThan(
      horizontalSpeedMult(base),
    );
  });

  it('elytra swim requires water + elytra', () => {
    expect(canElytraSwim({ ...base, elytraSwimming: true })).toBe(true);
    expect(canElytraSwim({ ...base, inWater: false, elytraSwimming: true })).toBe(false);
  });
});
