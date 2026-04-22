// Wolf variants (1.20.5+). Biome-driven color variants: pale (taiga),
// ashen (snowy taiga), black (old-growth pine), chestnut (old-growth
// spruce), rusty (sparse jungle), snowy (grove), spotted (savanna
// plateau), striped (wooded badlands), woods (forest).

export type WolfVariant =
  | 'pale'
  | 'ashen'
  | 'black'
  | 'chestnut'
  | 'rusty'
  | 'snowy'
  | 'spotted'
  | 'striped'
  | 'woods';

export interface WolfVariantDef {
  variant: WolfVariant;
  biomes: readonly string[];
  baseColor: readonly [number, number, number];
}

export const WOLF_VARIANTS: Record<WolfVariant, WolfVariantDef> = {
  pale: {
    variant: 'pale',
    biomes: ['taiga'],
    baseColor: [220, 220, 210],
  },
  ashen: {
    variant: 'ashen',
    biomes: ['snowy_taiga'],
    baseColor: [172, 172, 172],
  },
  black: {
    variant: 'black',
    biomes: ['old_growth_pine_taiga'],
    baseColor: [34, 34, 34],
  },
  chestnut: {
    variant: 'chestnut',
    biomes: ['old_growth_spruce_taiga'],
    baseColor: [110, 70, 46],
  },
  rusty: {
    variant: 'rusty',
    biomes: ['sparse_jungle'],
    baseColor: [170, 88, 48],
  },
  snowy: {
    variant: 'snowy',
    biomes: ['grove'],
    baseColor: [245, 245, 245],
  },
  spotted: {
    variant: 'spotted',
    biomes: ['savanna_plateau'],
    baseColor: [190, 160, 100],
  },
  striped: {
    variant: 'striped',
    biomes: ['wooded_badlands'],
    baseColor: [180, 100, 40],
  },
  woods: {
    variant: 'woods',
    biomes: ['forest'],
    baseColor: [170, 140, 100],
  },
};

// Pick a wolf variant for a given biome; defaults to woods if no match.
export function wolfVariantFor(biome: string): WolfVariant {
  for (const def of Object.values(WOLF_VARIANTS)) {
    if (def.biomes.includes(biome)) return def.variant;
  }
  return 'woods';
}
