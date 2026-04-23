// Village structure types + biome-specific styles.

export type VillageBiome = 'plains' | 'desert' | 'savanna' | 'taiga' | 'snowy';

const BIOME_MATERIAL: Record<VillageBiome, { plank: string; roof: string; path: string }> = {
  plains: { plank: 'oak_planks', roof: 'oak_stairs', path: 'dirt_path' },
  desert: { plank: 'sandstone', roof: 'smooth_sandstone_stairs', path: 'sandstone' },
  savanna: { plank: 'acacia_planks', roof: 'acacia_stairs', path: 'dirt_path' },
  taiga: { plank: 'spruce_planks', roof: 'spruce_stairs', path: 'dirt_path' },
  snowy: { plank: 'spruce_planks', roof: 'spruce_stairs', path: 'dirt_path' },
};

export function materialsFor(biome: VillageBiome): { plank: string; roof: string; path: string } {
  return BIOME_MATERIAL[biome];
}

export function villagerProfessionForJob(job: string): string {
  if (job === 'barrel') return 'fisherman';
  if (job === 'composter') return 'farmer';
  if (job === 'lectern') return 'librarian';
  if (job === 'blast_furnace') return 'armorer';
  return 'none';
}

export const VILLAGE_TOTAL_BUILDINGS_MIN = 5;
export const VILLAGE_TOTAL_BUILDINGS_MAX = 25;
