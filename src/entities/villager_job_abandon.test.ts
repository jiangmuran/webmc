import { describe, it, expect } from 'vitest';
import {
  shouldAbandon,
  retainsLevelIfTraded,
  TRADE_LOCKOUT_TICKS,
  type Employment,
} from './villager_job_abandon';

describe('villager job abandon', () => {
  it('abandons after lockout', () => {
    const e: Employment = {
      profession: 'farmer',
      hasTradedAtLeastOnce: false,
      workstationDestroyedAtTick: 0,
    };
    expect(shouldAbandon(e, false, TRADE_LOCKOUT_TICKS)).toBe(true);
  });

  it('keeps job while workstation up', () => {
    const e: Employment = { profession: 'farmer', hasTradedAtLeastOnce: false };
    expect(shouldAbandon(e, true, 9999)).toBe(false);
  });

  it('still within lockout', () => {
    const e: Employment = {
      profession: 'farmer',
      hasTradedAtLeastOnce: false,
      workstationDestroyedAtTick: 100,
    };
    expect(shouldAbandon(e, false, 200)).toBe(false);
  });

  it('retain level if ever traded', () => {
    expect(retainsLevelIfTraded({ profession: 'farmer', hasTradedAtLeastOnce: true })).toBe(true);
  });

  it('traded villager NEVER abandons profession (wiki)', () => {
    // Wiki minecraft.wiki/w/Villager#Profession: "Once a villager
    // has traded with a player, it keeps its profession even if the
    // workstation is destroyed." Lockout timer doesn't apply.
    const e: Employment = {
      profession: 'librarian',
      hasTradedAtLeastOnce: true,
      workstationDestroyedAtTick: 0,
    };
    // Past lockout → still doesn't abandon.
    expect(shouldAbandon(e, false, TRADE_LOCKOUT_TICKS * 100)).toBe(false);
  });
});
