export const CACTUS_DAMAGE_PER_TICK = 1;
export const MAX_HEIGHT = 3;

export function canPlace(belowId: string, hasAdjacentBlock: boolean): boolean {
  if (belowId !== 'sand' && belowId !== 'red_sand' && belowId !== 'cactus') return false;
  return !hasAdjacentBlock;
}

export function shouldGrow(currentHeight: number, rng: () => number): boolean {
  if (currentHeight >= MAX_HEIGHT) return false;
  return rng() < 1 / 16;
}

export function damagesEntity(touching: boolean, invulnerable: boolean): number {
  return touching && !invulnerable ? CACTUS_DAMAGE_PER_TICK : 0;
}

export function breaksAdjacentItem(droppedItem: boolean): boolean {
  return droppedItem;
}
