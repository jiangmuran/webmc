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

// Wiki (minecraft.wiki/w/Wolf#Variants): biome → variant mapping —
//   taiga                    → pale (default)
//   forest                   → woods
//   snowy_taiga              → ashen
//   old_growth_pine_taiga    → black
//   old_growth_spruce_taiga  → chestnut
//   sparse_jungle            → rusty
//   savanna_plateau          → spotted
//   wooded_badlands          → striped
//   grove                    → snowy
// Old map had ashen ↔ striped, rusty ↔ spotted, ashen ↔ snowy
// swapped, and used `savanna` (not a wolf biome) instead of
// `sparse_jungle` for rusty.
const BIOME_VARIANT: Record<string, WolfVariant> = {
  taiga: 'pale',
  forest: 'woods',
  snowy_taiga: 'ashen',
  old_growth_pine_taiga: 'black',
  old_growth_spruce_taiga: 'chestnut',
  sparse_jungle: 'rusty',
  savanna_plateau: 'spotted',
  wooded_badlands: 'striped',
  grove: 'snowy',
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
