export type TreeType =
  | 'oak'
  | 'birch'
  | 'spruce'
  | 'dark_oak'
  | 'jungle'
  | 'acacia'
  | 'cherry'
  | 'pale_oak'
  | 'mangrove'
  | 'azalea';

export function treesForBiome(biome: string): readonly TreeType[] {
  switch (biome) {
    case 'plains':
      return ['oak'];
    case 'forest':
      return ['oak', 'birch'];
    case 'birch_forest':
      return ['birch'];
    case 'taiga':
      return ['spruce'];
    case 'dark_forest':
      return ['dark_oak'];
    case 'jungle':
      return ['jungle'];
    case 'savanna':
      return ['acacia'];
    case 'cherry_grove':
      return ['cherry'];
    case 'pale_garden':
      return ['pale_oak'];
    case 'mangrove_swamp':
      return ['mangrove'];
    case 'lush_caves':
      return ['azalea'];
    default:
      return [];
  }
}

export function treesPerChunk(biome: string, rng: () => number): number {
  const t = treesForBiome(biome);
  if (t.length === 0) return 0;
  if (biome === 'jungle') return 20 + Math.floor(rng() * 20);
  if (biome === 'dark_forest') return 15;
  if (biome === 'savanna') return 1 + Math.floor(rng() * 2);
  return 1 + Math.floor(rng() * 3);
}
