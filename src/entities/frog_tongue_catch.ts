// Frog tongue catches small mobs (slime, magma cube small) for food.
// Magma cube drop: frogs eat it and produce froglight matching variant.

export type FrogVariant = 'temperate' | 'warm' | 'cold';
export type Froglight = 'pearlescent' | 'ochre' | 'verdant';

// Wiki (minecraft.wiki/w/Froglight#Acquisition): canonical mapping is
//   Warm      → Pearlescent
//   Temperate → Ochre
//   Cold      → Verdant
// A previous "fix" swapped temperate↔warm based on a thematic guess
// (orange frog ≈ ochre, white frog ≈ pearlescent) — the wiki table
// reverses that intuition. Siblings frog_eat_entity.ts /
// frog_light_produce.ts / frog_variant_biome.ts were already fixed
// in an earlier session; this is the 4th and final sibling.
export function froglightFor(variant: FrogVariant): Froglight {
  if (variant === 'warm') return 'pearlescent';
  if (variant === 'temperate') return 'ochre';
  return 'verdant';
}

export interface CatchQuery {
  targetType: string;
  targetSize: number;
}

export function canCatch(q: CatchQuery): boolean {
  if (q.targetType === 'slime' && q.targetSize === 1) return true;
  if (q.targetType === 'magma_cube' && q.targetSize === 1) return true;
  return false;
}

export const FROG_TONGUE_RANGE = 10;

export function inTongueRange(distance: number): boolean {
  return distance <= FROG_TONGUE_RANGE;
}
