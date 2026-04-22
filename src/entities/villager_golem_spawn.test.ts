import { describe, it, expect } from 'vitest';
import {
  tryGolemSpawn,
  maxGolemsForPopulation,
  PANIC_VILLAGERS_THRESHOLD,
} from './villager_golem_spawn';

describe('iron golem spawn', () => {
  it('needs villagers', () => {
    const r = tryGolemSpawn({
      villagersInPanicArea: PANIC_VILLAGERS_THRESHOLD - 1,
      openSpaceCount: 5,
      recentGolemSpawnsInVillage: 0,
      maxGolemsInVillage: 2,
    });
    expect(r.spawn).toBe(false);
    expect(r.reason).toBe('not_enough_villagers');
  });

  it('no space fails', () => {
    expect(
      tryGolemSpawn({
        villagersInPanicArea: 5,
        openSpaceCount: 0,
        recentGolemSpawnsInVillage: 0,
        maxGolemsInVillage: 2,
      }).spawn,
    ).toBe(false);
  });

  it('cap fails', () => {
    expect(
      tryGolemSpawn({
        villagersInPanicArea: 5,
        openSpaceCount: 5,
        recentGolemSpawnsInVillage: 2,
        maxGolemsInVillage: 2,
      }).spawn,
    ).toBe(false);
  });

  it('ok spawn', () => {
    expect(
      tryGolemSpawn({
        villagersInPanicArea: 5,
        openSpaceCount: 5,
        recentGolemSpawnsInVillage: 0,
        maxGolemsInVillage: 2,
      }).spawn,
    ).toBe(true);
  });

  it('pop cap', () => {
    expect(maxGolemsForPopulation(0)).toBe(1);
    expect(maxGolemsForPopulation(50)).toBe(5);
  });
});
