import { describe, it, expect } from 'vitest';
import {
  isVillage,
  canSpawnIronGolem,
  raidSizeMultiplier,
  IRON_GOLEM_VILLAGER_THRESHOLD,
} from './village_site_score';

describe('village scoring', () => {
  it('empty is not a village', () => {
    expect(isVillage({ beds: 0, villagers: 0, jobSites: 0 })).toBe(false);
  });

  it('threshold', () => {
    expect(isVillage({ beds: 3, villagers: 2, jobSites: 0 })).toBe(true);
    expect(isVillage({ beds: 2, villagers: 10, jobSites: 3 })).toBe(false);
  });

  it('golem requires village + villagers', () => {
    expect(
      canSpawnIronGolem({ beds: 3, villagers: IRON_GOLEM_VILLAGER_THRESHOLD, jobSites: 0 }),
    ).toBe(true);
    expect(canSpawnIronGolem({ beds: 3, villagers: 3, jobSites: 0 })).toBe(false);
  });

  it('raid size scales by beds', () => {
    expect(raidSizeMultiplier({ beds: 0, villagers: 0, jobSites: 0 })).toBe(0);
    expect(raidSizeMultiplier({ beds: 9, villagers: 2, jobSites: 0 })).toBe(4);
  });
});
