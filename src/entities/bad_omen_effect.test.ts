import { describe, it, expect } from 'vitest';
import { triggersRaid, raidDifficultyBump, clearsOnEnterVillage } from './bad_omen_effect';

describe('bad omen effect', () => {
  it('triggers raid in village', () => {
    expect(triggersRaid({ level: 1, inVillage: true, raidActive: false })).toBe(true);
  });

  it('no trigger outside village', () => {
    expect(triggersRaid({ level: 1, inVillage: false, raidActive: false })).toBe(false);
  });

  it('no trigger during active raid', () => {
    expect(triggersRaid({ level: 2, inVillage: true, raidActive: true })).toBe(false);
  });

  it('difficulty bump clamps', () => {
    expect(raidDifficultyBump({ level: 100, inVillage: true, raidActive: false })).toBe(4);
    expect(raidDifficultyBump({ level: 0, inVillage: true, raidActive: false })).toBe(0);
  });

  it('clears after trigger', () => {
    expect(clearsOnEnterVillage({ level: 1, inVillage: true, raidActive: false })).toBe(true);
  });
});
