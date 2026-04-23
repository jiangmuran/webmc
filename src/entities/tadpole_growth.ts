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

export function variantForBiome(biome: string): FrogVariant {
  if (biome === 'jungle' || biome === 'bamboo_jungle' || biome === 'desert' || biome === 'savanna')
    return 'warm';
  if (biome.includes('snowy') || biome.includes('frozen') || biome === 'grove') return 'cold';
  return 'temperate';
}
