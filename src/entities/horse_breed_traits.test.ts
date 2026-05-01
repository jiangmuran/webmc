import { describe, it, expect } from 'vitest';
import {
  breedOffspring,
  estimatedJumpHeightBlocks,
  HEALTH_RANGE,
  SPEED_RANGE,
  JUMP_RANGE,
  type HorseStats,
} from './horse_breed_traits';

const avg: HorseStats = { health: 22, speed: 0.22, jumpStrength: 0.7 };

describe('horse breed traits', () => {
  it('offspring within health range', () => {
    const o = breedOffspring(avg, avg, () => 0.5);
    expect(o.health).toBeGreaterThanOrEqual(HEALTH_RANGE[0]);
    expect(o.health).toBeLessThanOrEqual(HEALTH_RANGE[1]);
  });

  it('offspring within speed range', () => {
    const o = breedOffspring(avg, avg, () => 0.5);
    expect(o.speed).toBeGreaterThanOrEqual(SPEED_RANGE[0]);
    expect(o.speed).toBeLessThanOrEqual(SPEED_RANGE[1]);
  });

  it('offspring within jump range', () => {
    const o = breedOffspring(avg, avg, () => 0.5);
    expect(o.jumpStrength).toBeGreaterThanOrEqual(JUMP_RANGE[0]);
    expect(o.jumpStrength).toBeLessThanOrEqual(JUMP_RANGE[1]);
  });

  it('high jump > low jump height', () => {
    expect(estimatedJumpHeightBlocks(1)).toBeGreaterThan(estimatedJumpHeightBlocks(0.4));
  });

  it('zero jump small', () => {
    expect(estimatedJumpHeightBlocks(0)).toBeLessThan(1);
  });

  it('top-tier parents can reach wiki health upper bound (was clamped low)', () => {
    // With both parents at 30 HP and rng=1 (max R = 30), the wiki
    // formula yields (30 + 30 + 30)/3 = 30. Old code without the
    // +min offset gave (30 + 30 + 15)/3 = 25.
    const elite: HorseStats = { health: 30, speed: 0.3375, jumpStrength: 1 };
    const o = breedOffspring(elite, elite, () => 1);
    expect(o.health).toBeCloseTo(30, 5);
    expect(o.jumpStrength).toBeCloseTo(1, 5);
    expect(o.speed).toBeCloseTo(0.3375, 5);
  });
});
