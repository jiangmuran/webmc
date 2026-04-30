import { describe, it, expect } from 'vitest';
import { toolSkipChance, armorSkipChance, rollConsumesDurability } from './unbreaking_enchant';

describe('unbreaking', () => {
  it('no level no skip', () => {
    expect(toolSkipChance(0)).toBe(0);
  });

  it('tool 3 = 75%', () => {
    expect(toolSkipChance(3)).toBeCloseTo(0.75);
  });

  it('armor skip chances 20%/26.7%/30% per wiki', () => {
    expect(armorSkipChance(1)).toBeCloseTo(0.2);
    expect(armorSkipChance(2)).toBeCloseTo(0.2667, 3);
    expect(armorSkipChance(3)).toBeCloseTo(0.3);
  });

  it('always consumes at level 0', () => {
    expect(rollConsumesDurability(0, () => 0.5, false)).toBe(true);
    expect(rollConsumesDurability(0, () => 0.5, true)).toBe(true);
  });

  it('skip at high level with low roll (tool)', () => {
    expect(rollConsumesDurability(3, () => 0, false)).toBe(false);
  });

  it('Unbreaking III armor: 70% chance to consume (wiki)', () => {
    // skip = 0.3, so rand 0.31 (just above) consumes.
    expect(rollConsumesDurability(3, () => 0.31, true)).toBe(true);
    // rand 0.29 (just below) skips.
    expect(rollConsumesDurability(3, () => 0.29, true)).toBe(false);
  });
});
