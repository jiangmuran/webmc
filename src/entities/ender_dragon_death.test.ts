import { describe, it, expect } from 'vitest';
import {
  xpSpawnedAt,
  atExitPortalSpawnTick,
  playerPlacedDragonEgg,
  totalXpForKill,
  DEATH_SEQUENCE_TICKS,
  TOTAL_XP,
  FIRST_KILL_XP,
  SUBSEQUENT_KILL_XP,
} from './ender_dragon_death';

describe('ender dragon death', () => {
  it('all xp by end', () => {
    expect(xpSpawnedAt(DEATH_SEQUENCE_TICKS, TOTAL_XP)).toBe(TOTAL_XP);
  });

  it('0 xp at start', () => {
    expect(xpSpawnedAt(0, TOTAL_XP)).toBe(0);
  });

  it('portal at end', () => {
    expect(atExitPortalSpawnTick(DEATH_SEQUENCE_TICKS)).toBe(true);
    expect(atExitPortalSpawnTick(50)).toBe(false);
  });

  it('dragon egg on first kill', () => {
    expect(playerPlacedDragonEgg(true)).toBe(true);
    expect(playerPlacedDragonEgg(false)).toBe(false);
  });

  it('first kill drops 12000 XP, subsequent drop 500 (wiki)', () => {
    // Wiki minecraft.wiki/w/Ender_Dragon#Death_sequence: "The first
    // kill drops 12,000 experience; subsequent kills drop 500."
    expect(FIRST_KILL_XP).toBe(12000);
    expect(SUBSEQUENT_KILL_XP).toBe(500);
    expect(totalXpForKill(true)).toBe(12000);
    expect(totalXpForKill(false)).toBe(500);
  });
});
