// Frog tongue catches small mobs (slime, magma cube small) for food.
// Magma cube drop: frogs eat it and produce froglight matching variant.

export type FrogVariant = 'temperate' | 'warm' | 'cold';
export type Froglight = 'pearlescent' | 'ochre' | 'verdant';

export function froglightFor(variant: FrogVariant): Froglight {
  if (variant === 'temperate') return 'ochre';
  if (variant === 'warm') return 'pearlescent';
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
