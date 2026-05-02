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

// Wiki (minecraft.wiki/w/Villager#Profession): full job-block →
// profession map. Old map covered only 4 of 13 professions, leaving
// brewing_stand, cartography_table, cauldron, fletching_table,
// grindstone, loom, smithing_table, smoker, and stonecutter
// unprofessional — placing those job blocks in a village with
// jobless villagers wouldn't claim them.
const PROFESSION_FOR_JOB: Record<string, string> = {
  barrel: 'fisherman',
  blast_furnace: 'armorer',
  brewing_stand: 'cleric',
  cartography_table: 'cartographer',
  cauldron: 'leatherworker',
  composter: 'farmer',
  fletching_table: 'fletcher',
  grindstone: 'weaponsmith',
  lectern: 'librarian',
  loom: 'shepherd',
  smithing_table: 'toolsmith',
  smoker: 'butcher',
  stonecutter: 'mason',
};

export function villagerProfessionForJob(job: string): string {
  return PROFESSION_FOR_JOB[job] ?? 'none';
}

export const VILLAGE_TOTAL_BUILDINGS_MIN = 5;
export const VILLAGE_TOTAL_BUILDINGS_MAX = 25;
