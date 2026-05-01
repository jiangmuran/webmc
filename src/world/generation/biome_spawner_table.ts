export interface SpawnEntry {
  mob: string;
  weight: number;
  min: number;
  max: number;
}

// Wiki (minecraft.wiki/w/Plains): plains passive spawns include
// cow (8), sheep (12), pig (10), chicken (10), horse (5, group 2-6),
// donkey (1, group 1-3). Old list omitted chicken and donkey, so a
// fresh-spawned plains biome could never naturally produce either.
// Sibling biome_mob_spawn_lists.ts already lists chicken; donkey is
// new for both.
export const BY_BIOME: Record<string, SpawnEntry[]> = {
  plains: [
    { mob: 'cow', weight: 8, min: 4, max: 4 },
    { mob: 'sheep', weight: 12, min: 4, max: 4 },
    { mob: 'pig', weight: 10, min: 4, max: 4 },
    { mob: 'chicken', weight: 10, min: 4, max: 4 },
    { mob: 'horse', weight: 5, min: 2, max: 6 },
    { mob: 'donkey', weight: 1, min: 1, max: 3 },
  ],
  desert: [{ mob: 'rabbit', weight: 4, min: 2, max: 3 }],
  // Wiki (minecraft.wiki/w/Nether_Wastes): hostile mob spawns include
  // zombified_piglin (100), ghast (50), magma_cube (2), piglin (15),
  // and enderman (1). Old table was missing piglin and enderman, which
  // meant a fresh nether_wastes generation could never produce piglins
  // — breaking bartering loops.
  nether_wastes: [
    { mob: 'zombified_piglin', weight: 100, min: 4, max: 4 },
    { mob: 'ghast', weight: 50, min: 4, max: 4 },
    { mob: 'magma_cube', weight: 2, min: 4, max: 4 },
    { mob: 'piglin', weight: 15, min: 4, max: 4 },
    { mob: 'enderman', weight: 1, min: 4, max: 4 },
  ],
};

export function spawnersFor(biome: string): SpawnEntry[] {
  return BY_BIOME[biome] ?? [];
}

export function totalWeight(biome: string): number {
  return spawnersFor(biome).reduce((a, b) => a + b.weight, 0);
}
