import { describe, it, expect } from 'vitest';
import { toolSkipChance, armorSkipChance, rollConsumesDurability } from './unbreaking_enchant';

describe('unbreaking', () => {
  it('no level no skip', () => {
    expect(toolSkipChance(0)).toBe(0);
  });

  it('tool 3 = 75%', () => {
    expect(toolSkipChance(3)).toBeCloseTo(0.75);
  });

  it('armor 3 = 70%', () => {
    expect(armorSkipChance(3)).toBeCloseTo(0.7);
  });

  it('always consumes at level 0', () => {
    expect(rollConsumesDurability(0, () => 0.5, false)).toBe(true);
  });

  it('skip at high level with low roll', () => {
    expect(rollConsumesDurability(3, () => 0, false)).toBe(false);
  });
});
