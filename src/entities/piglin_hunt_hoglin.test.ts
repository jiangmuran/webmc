import { describe, it, expect } from 'vitest';
import { shouldHunt, ignoresPlayerWearingGold } from './piglin_hunt_hoglin';

describe('piglin hunt hoglin', () => {
  it('hunts in nether with target', () => {
    expect(shouldHunt({ isInNether: true, hasGoldenItem: false, targetHoglin: true })).toBe(true);
  });

  it('overworld no hunt', () => {
    expect(shouldHunt({ isInNether: false, hasGoldenItem: false, targetHoglin: true })).toBe(false);
  });

  it('gold armor pacifies player detection', () => {
    expect(
      ignoresPlayerWearingGold({ isInNether: true, hasGoldenItem: true, targetHoglin: false }),
    ).toBe(true);
  });
});
