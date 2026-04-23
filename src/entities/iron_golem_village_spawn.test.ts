import { describe, it, expect } from 'vitest';
import {
  canSpawnGolem,
  spawnPriorityBoost,
  spawnCapForVillageSize,
} from './iron_golem_village_spawn';

describe('iron golem village spawn', () => {
  it('min villager + beds + work', () => {
    expect(
      canSpawnGolem({
        villagerCount: 3,
        bedsClaimed: 2,
        workstationsClaimed: 2,
        recentAttackTicks: 0,
      }),
    ).toBe(true);
  });

  it('small village rejects', () => {
    expect(
      canSpawnGolem({
        villagerCount: 1,
        bedsClaimed: 1,
        workstationsClaimed: 1,
        recentAttackTicks: 0,
      }),
    ).toBe(false);
  });

  it('priority boost on attack', () => {
    expect(
      spawnPriorityBoost({
        villagerCount: 10,
        bedsClaimed: 5,
        workstationsClaimed: 5,
        recentAttackTicks: 100,
      }),
    ).toBeGreaterThan(1);
  });

  it('cap scales', () => {
    expect(spawnCapForVillageSize(25)).toBe(3);
    expect(spawnCapForVillageSize(5)).toBe(1);
  });
});
