export type BiomeId =
  | 'plains'
  | 'forest'
  | 'birch_forest'
  | 'dark_forest'
  | 'desert'
  | 'taiga'
  | 'snowy_plains'
  | 'savanna'
  | 'swamp'
  | 'mangrove_swamp'
  | 'ocean'
  | 'deep_ocean'
  | 'beach'
  | 'jungle'
  | 'cherry_grove'
  | 'pale_garden'
  | 'lush_caves'
  | 'dripstone_caves'
  | 'mushroom_fields'
  | 'nether_wastes'
  | 'crimson_forest'
  | 'warped_forest'
  | 'soul_sand_valley'
  | 'basalt_deltas'
  | 'the_end'
  | 'end_highlands'
  | 'end_midlands'
  | 'small_end_islands'
  | 'end_barrens'
  | 'deep_dark';

export interface BiomeDef {
  id: BiomeId;
  temperature: number;
  downfall: number;
  isHostileSpawn: boolean;
  dimension: 'overworld' | 'nether' | 'end';
}

export const REGISTRY: Record<string, BiomeDef> = {
  plains: { id: 'plains', temperature: 0.8, downfall: 0.4, isHostileSpawn: true, dimension: 'overworld' },
  forest: { id: 'forest', temperature: 0.7, downfall: 0.8, isHostileSpawn: true, dimension: 'overworld' },
  desert: { id: 'desert', temperature: 2, downfall: 0, isHostileSpawn: true, dimension: 'overworld' },
  snowy_plains: { id: 'snowy_plains', temperature: -0.5, downfall: 0.5, isHostileSpawn: true, dimension: 'overworld' },
  ocean: { id: 'ocean', temperature: 0.5, downfall: 0.5, isHostileSpawn: true, dimension: 'overworld' },
  nether_wastes: { id: 'nether_wastes', temperature: 2, downfall: 0, isHostileSpawn: true, dimension: 'nether' },
  the_end: { id: 'the_end', temperature: 0.5, downfall: 0.5, isHostileSpawn: true, dimension: 'end' },
};

export function biomeOf(id: string): BiomeDef | undefined {
  return REGISTRY[id];
}

export function allOfDimension(dim: 'overworld' | 'nether' | 'end'): BiomeDef[] {
  return Object.values(REGISTRY).filter((b) => b.dimension === dim);
}
