// Wolf variants introduced in 1.20.5+. Biome-based spawn selection.

export type WolfVariant =
  | 'pale'
  | 'woods'
  | 'ashen'
  | 'black'
  | 'chestnut'
  | 'rusty'
  | 'spotted'
  | 'striped'
  | 'snowy';

const BIOME_VARIANT: Record<string, WolfVariant> = {
  taiga: 'pale',
  forest: 'woods',
  wooded_badlands: 'ashen',
  old_growth_pine_taiga: 'black',
  old_growth_spruce_taiga: 'chestnut',
  savanna_plateau: 'rusty',
  savanna: 'spotted',
  snowy_taiga: 'snowy',
  grove: 'striped',
};

export function variantForBiome(biome: string): WolfVariant {
  return BIOME_VARIANT[biome] ?? 'pale';
}

export function breedChildVariant(
  a: WolfVariant,
  b: WolfVariant,
  biomeFallback: string,
): WolfVariant {
  if (Math.random() < 0.5) return a;
  if (Math.random() < 0.5) return b;
  return variantForBiome(biomeFallback);
}
