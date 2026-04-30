// Hostile mob spawn checks (Java Edition). Block light must be 0 in
// the overworld (1.18+ rule). Daytime spawning is gated by sky light
// level 7 or below — anything higher prevents spawning. Nether and
// End follow their own light rules.
//
// Wiki (minecraft.wiki/w/Mob_spawning): "Most hostile mobs in the
// Overworld can only spawn at block light level of 0. Additionally,
// during the day, the sky light level at the spawn position must be
// 7 or below."
//
// Old `q.skyLight >= 10` block was 2 levels too lax — sky light 8
// and 9 during the day would let mobs spawn even though the wiki
// caps it at ≤ 7. The block-light check (≥ 1 → false) is correct
// for 1.18+.

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
  if (q.isDay && q.skyLight > 7) return false;
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
