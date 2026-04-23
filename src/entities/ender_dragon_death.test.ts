import { describe, it, expect } from 'vitest';
import {
  xpSpawnedAt,
  atExitPortalSpawnTick,
  playerPlacedDragonEgg,
  DEATH_SEQUENCE_TICKS,
  TOTAL_XP,
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
});
