export const BIOME_TREE_DENSITY: Record<string, number> = {
  plains: 0.02,
  forest: 0.12,
  birch_forest: 0.15,
  dark_forest: 0.35,
  taiga: 0.18,
  snowy_taiga: 0.15,
  jungle: 0.45,
  sparse_jungle: 0.3,
  bamboo_jungle: 0.35,
  savanna: 0.04,
  desert: 0,
  swamp: 0.1,
  cherry_grove: 0.15,
  pale_garden: 0.1,
  mushroom_fields: 0.08,
  flower_forest: 0.12,
  ice_spikes: 0,
  ocean: 0,
  river: 0,
};

export function densityFor(biome: string): number {
  return BIOME_TREE_DENSITY[biome] ?? 0.05;
}

export function treesPerChunk(biome: string): number {
  return Math.round(densityFor(biome) * 256);
}
