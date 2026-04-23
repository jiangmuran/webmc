export interface SpawnEntry {
  mob: string;
  weight: number;
  min: number;
  max: number;
}

export const BY_BIOME: Record<string, SpawnEntry[]> = {
  plains: [
    { mob: 'cow', weight: 8, min: 4, max: 4 },
    { mob: 'sheep', weight: 12, min: 4, max: 4 },
    { mob: 'pig', weight: 10, min: 4, max: 4 },
    { mob: 'horse', weight: 5, min: 2, max: 6 },
  ],
  desert: [
    { mob: 'rabbit', weight: 4, min: 2, max: 3 },
  ],
  nether_wastes: [
    { mob: 'zombified_piglin', weight: 100, min: 4, max: 4 },
    { mob: 'ghast', weight: 50, min: 4, max: 4 },
    { mob: 'magma_cube', weight: 2, min: 4, max: 4 },
  ],
};

export function spawnersFor(biome: string): SpawnEntry[] {
  return BY_BIOME[biome] ?? [];
}

export function totalWeight(biome: string): number {
  return spawnersFor(biome).reduce((a, b) => a + b.weight, 0);
}
