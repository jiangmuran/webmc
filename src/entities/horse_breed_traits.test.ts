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
});
