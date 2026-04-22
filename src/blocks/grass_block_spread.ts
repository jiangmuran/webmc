// Grass spread. Grass/mycelium/podzol spread to nearby dirt if light
// above is ≥ 9 and dirt block is not obscured. Grass dies back to
// dirt if its own light < 4.

export interface GrassSpreadQuery {
  sourceBlockId: 'webmc:grass_block' | 'webmc:mycelium' | 'webmc:podzol';
  targetIsDirt: boolean;
  lightAboveTarget: number;
  targetObstructedAbove: boolean;
}

export function canSpread(q: GrassSpreadQuery): boolean {
  if (!q.targetIsDirt) return false;
  if (q.targetObstructedAbove) return false;
  return q.lightAboveTarget >= 9;
}

// Grass dieback.
export interface DiebackQuery {
  blockId: 'webmc:grass_block' | 'webmc:mycelium' | 'webmc:podzol';
  lightAbove: number;
  obstructedAbove: boolean;
}

export function diesBack(q: DiebackQuery): boolean {
  if (!q.obstructedAbove && q.lightAbove >= 4) return false;
  return q.lightAbove < 4 || q.obstructedAbove;
}

// Mycelium decay is slightly faster but otherwise same.
export const DECAY_CHANCE_GRASS = 0.01;
export const DECAY_CHANCE_MYCELIUM = 0.02;

export function decayChance(
  blockId: 'webmc:grass_block' | 'webmc:mycelium' | 'webmc:podzol',
): number {
  if (blockId === 'webmc:mycelium') return DECAY_CHANCE_MYCELIUM;
  return DECAY_CHANCE_GRASS;
}
