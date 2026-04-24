import { describe, it, expect } from 'vitest';
import { needleAngle, lodestoneLocked } from './compass_needle_target';

describe('compass needle target', () => {
  it('target north facing north near zero', () => {
    const a = needleAngle({
      playerX: 0,
      playerZ: 0,
      targetX: 0,
      targetZ: -10,
      playerYaw: 0,
      worldDimensionMatches: true,
    });
    expect(Math.abs(a)).toBeLessThan(0.001);
  });

  it('target behind produces pi', () => {
    const a = needleAngle({
      playerX: 0,
      playerZ: 0,
      targetX: 0,
      targetZ: 10,
      playerYaw: 0,
      worldDimensionMatches: true,
    });
    expect(Math.abs(Math.abs(a) - Math.PI)).toBeLessThan(0.001);
  });

  it('wrong dimension spins', () => {
    const a1 = needleAngle({
      playerX: 0,
      playerZ: 0,
      targetX: 5,
      targetZ: 0,
      playerYaw: 0,
      worldDimensionMatches: false,
    });
    expect(Number.isFinite(a1)).toBe(true);
  });

  it('lodestone lock detected', () => {
    expect(lodestoneLocked({ x: 0, y: 0, z: 0 })).toBe(true);
    expect(lodestoneLocked()).toBe(false);
  });
});
