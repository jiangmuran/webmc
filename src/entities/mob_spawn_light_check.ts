// Hostile mob spawn checks. Must be at light level < 1 in overworld
// (1.20+: < 0 for blocklight). Nether hostile ignores. End: no spawn.

export interface LightSpawnQuery {
  dimension: 'overworld' | 'nether' | 'end';
  blockLight: number;
  skyLight: number;
  isDay: boolean;
  monsterCategory: 'overworld_hostile' | 'nether_hostile' | 'end_hostile';
}

export function canSpawnByLight(q: LightSpawnQuery): boolean {
  if (q.dimension === 'end') return q.monsterCategory === 'end_hostile';
  if (q.dimension === 'nether') return q.monsterCategory === 'nether_hostile';
  if (q.monsterCategory !== 'overworld_hostile') return false;
  if (q.blockLight >= 1) return false;
  if (q.isDay && q.skyLight >= 10) return false;
  return true;
}

// Additional spawn rules: must be on solid block + 2 blocks air above.
export interface SolidCheckQuery {
  groundSolid: boolean;
  headSpaceClear: boolean;
  spawnNotInWater: boolean;
}

export function surfaceOk(q: SolidCheckQuery): boolean {
  return q.groundSolid && q.headSpaceClear && q.spawnNotInWater;
}
