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

// Wiki (minecraft.wiki/w/Wolf#Variants):
//   taiga                    → pale
//   forest                   → woods
//   snowy_taiga              → ashen
//   old_growth_pine_taiga    → black
//   old_growth_spruce_taiga  → chestnut
//   sparse_jungle            → rusty
//   savanna_plateau          → spotted
//   wooded_badlands          → striped
//   grove                    → snowy
// Old switch had nearly every variant wrong: snowy_taiga→snowy (wiki:
// ashen), savanna_plateau→striped (wiki: spotted), pine_taiga shared
// chestnut with spruce_taiga (wiki: black/chestnut),
// sparse_jungle→spotted (wiki: rusty), grove→black (wiki: snowy),
// wooded_badlands→rusty (wiki: striped). Default also corrected from
// `woods` to `pale` (taiga is the canonical default).
export function variantForBiome(biome: string): WolfVariant {
  switch (biome) {
    case 'taiga':
      return 'pale';
    case 'forest':
      return 'woods';
    case 'snowy_taiga':
      return 'ashen';
    case 'old_growth_pine_taiga':
      return 'black';
    case 'old_growth_spruce_taiga':
      return 'chestnut';
    case 'sparse_jungle':
      return 'rusty';
    case 'savanna_plateau':
      return 'spotted';
    case 'wooded_badlands':
      return 'striped';
    case 'grove':
      return 'snowy';
    default:
      return 'pale';
  }
}
