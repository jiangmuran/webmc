import { describe, it, expect } from 'vitest';
import { canClimb, jumpChance, shouldAggro, type SpiderState } from './spider_climb_jumpy';

const base: SpiderState = {
  adjacentToWall: false,
  onGround: true,
  hasJockey: false,
  sneakingTarget: false,
};

describe('spider climb jumpy', () => {
  it('climbs when next to wall', () => {
    expect(canClimb({ ...base, adjacentToWall: true })).toBe(true);
  });

  it('no climb midair', () => {
    expect(canClimb(base)).toBe(false);
  });

  it('jump only on ground', () => {
    expect(jumpChance({ ...base, onGround: false })).toBe(0);
  });

  it('jockey reduces jumps', () => {
    expect(jumpChance({ ...base, hasJockey: true })).toBeLessThan(jumpChance(base));
  });

  it('aggros at night', () => {
    expect(shouldAggro(0, false, false)).toBe(true);
  });

  it('ignores sneaking target', () => {
    expect(shouldAggro(0, false, true)).toBe(false);
  });

  it('neutral in daylight', () => {
    expect(shouldAggro(15, true, false)).toBe(false);
  });

  it('neutral at night under torch (wiki: light ≥ 12 → passive any time)', () => {
    // Spider stays hostile when light ≤ 11 regardless of day/night.
    // Light ≥ 12 → passive, even at night.
    expect(shouldAggro(12, false, false)).toBe(false);
    expect(shouldAggro(15, false, false)).toBe(false);
    // light = 11 → hostile (boundary)
    expect(shouldAggro(11, false, false)).toBe(true);
  });
});
