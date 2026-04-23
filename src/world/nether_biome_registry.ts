// Nether biomes and their common features.

export type NetherBiome =
  | 'nether_wastes'
  | 'soul_sand_valley'
  | 'crimson_forest'
  | 'warped_forest'
  | 'basalt_deltas';

export interface NetherBiomeTraits {
  skyLight: number;
  fogColor: number;
  waterColor: number;
  floorBlock: string;
  ambientLoop: string | null;
}

const TRAITS: Record<NetherBiome, NetherBiomeTraits> = {
  nether_wastes: {
    skyLight: 0,
    fogColor: 0x330808,
    waterColor: 0x3f76e4,
    floorBlock: 'netherrack',
    ambientLoop: 'ambient.nether_wastes',
  },
  soul_sand_valley: {
    skyLight: 0,
    fogColor: 0x1b4745,
    waterColor: 0x3f76e4,
    floorBlock: 'soul_sand',
    ambientLoop: 'ambient.soul_sand_valley',
  },
  crimson_forest: {
    skyLight: 0,
    fogColor: 0x330303,
    waterColor: 0x3f76e4,
    floorBlock: 'crimson_nylium',
    ambientLoop: 'ambient.crimson_forest',
  },
  warped_forest: {
    skyLight: 0,
    fogColor: 0x1a051a,
    waterColor: 0x3f76e4,
    floorBlock: 'warped_nylium',
    ambientLoop: 'ambient.warped_forest',
  },
  basalt_deltas: {
    skyLight: 0,
    fogColor: 0x685f70,
    waterColor: 0x3f76e4,
    floorBlock: 'basalt',
    ambientLoop: 'ambient.basalt_deltas',
  },
};

export function traitsOf(b: NetherBiome): NetherBiomeTraits {
  return TRAITS[b];
}

export function isNetherBiome(s: string): s is NetherBiome {
  return s in TRAITS;
}
