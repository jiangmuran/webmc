export interface Cactus {
  age: number;
  adjacentToBlock: boolean;
}

export const MAX_AGE = 15;
export const MAX_HEIGHT = 3;

export function canGrow(c: Cactus, heightSoFar: number): boolean {
  if (c.adjacentToBlock) return false;
  if (heightSoFar >= MAX_HEIGHT) return false;
  return c.age >= MAX_AGE;
}

export function isBrokenByAdjacentBlock(c: Cactus): boolean {
  return c.adjacentToBlock;
}

export function damageToTouchingEntities(): number {
  return 1;
}
