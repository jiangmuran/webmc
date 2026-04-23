export type WolfVariant =
  | 'pale'
  | 'woods'
  | 'ashen'
  | 'black'
  | 'chestnut'
  | 'rusty'
  | 'snowy'
  | 'spotted'
  | 'striped';

export function variantForBiome(biome: string): WolfVariant {
  switch (biome) {
    case 'taiga':
      return 'pale';
    case 'forest':
      return 'woods';
    case 'snowy_taiga':
      return 'snowy';
    case 'savanna_plateau':
      return 'striped';
    case 'old_growth_spruce_taiga':
    case 'old_growth_pine_taiga':
      return 'chestnut';
    case 'sparse_jungle':
      return 'spotted';
    case 'grove':
      return 'black';
    case 'wooded_badlands':
      return 'rusty';
    default:
      return 'woods';
  }
}
