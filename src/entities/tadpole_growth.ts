// Tadpole → frog growth. Grows over ~24000 ticks while in water.
// Variant determined by the biome where it completes.

export const TADPOLE_GROW_TICKS = 24000;

export interface TadpoleState {
  ticksOld: number;
  inWater: boolean;
  biomeAtGrowth: string | null;
}

export function tick(s: TadpoleState): TadpoleState {
  if (!s.inWater) return s;
  return { ...s, ticksOld: s.ticksOld + 1 };
}

export function isReady(s: TadpoleState): boolean {
  return s.ticksOld >= TADPOLE_GROW_TICKS;
}

export type FrogVariant = 'temperate' | 'warm' | 'cold';

// Wiki (minecraft.wiki/w/Frog#Variants): tadpole maturing in a warm
// biome becomes a warm (orange) frog. The full warm list per wiki:
// desert, jungle, bamboo_jungle, savanna (+plateau/windswept),
// badlands (+eroded/wooded), mangrove_swamp. Cold biomes are
// snowy/frozen variants and grove.
const WARM_BIOMES = new Set([
  'desert',
  'jungle',
  'bamboo_jungle',
  'sparse_jungle',
  'savanna',
  'savanna_plateau',
  'windswept_savanna',
  'badlands',
  'eroded_badlands',
  'wooded_badlands',
  'mangrove_swamp',
]);

export function variantForBiome(biome: string): FrogVariant {
  if (WARM_BIOMES.has(biome)) return 'warm';
  if (biome.includes('snowy') || biome.includes('frozen') || biome === 'grove') return 'cold';
  return 'temperate';
}
