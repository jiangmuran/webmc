import { describe, it, expect } from 'vitest';
import { aimArrow, isCritical } from './arrow_spread';

describe('arrow aiming', () => {
  it('charge 0 → zero velocity', () => {
    const r = aimArrow({
      direction: { x: 1, y: 0, z: 0 },
      chargeRatio: 0,
      isFiredByPlayer: true,
      rng: () => 0.5,
    });
    expect(Math.abs(r.velocity.x)).toBeLessThan(0.01);
  });

  it('full charge → ~60 m/s speed', () => {
    const r = aimArrow({
      direction: { x: 1, y: 0, z: 0 },
      chargeRatio: 1,
      isFiredByPlayer: true,
      rng: () => 0.5,
    });
    expect(r.velocity.x).toBeGreaterThan(50);
  });

  it('skeleton spread is larger than player', () => {
    const samples = 200;
    let playerVar = 0;
    let skeletonVar = 0;
    for (let i = 0; i < samples; i++) {
      const p = aimArrow({
        direction: { x: 1, y: 0, z: 0 },
        chargeRatio: 1,
        isFiredByPlayer: true,
        rng: Math.random,
      });
      const s = aimArrow({
        direction: { x: 1, y: 0, z: 0 },
        chargeRatio: 1,
        isFiredByPlayer: false,
        rng: Math.random,
      });
      playerVar += Math.abs(p.velocity.y) + Math.abs(p.velocity.z);
      skeletonVar += Math.abs(s.velocity.y) + Math.abs(s.velocity.z);
    }
    expect(skeletonVar).toBeGreaterThan(playerVar);
  });

  it('isCritical at full charge', () => {
    expect(isCritical(1)).toBe(true);
    expect(isCritical(0.5)).toBe(false);
  });
});
