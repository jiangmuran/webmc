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
});
