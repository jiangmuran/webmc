export interface BreedCtx {
  lastBreedTick: number;
  currentTick: number;
  isBaby: boolean;
}

export const BREED_COOLDOWN_TICKS = 6000;

export function canBreed(c: BreedCtx): boolean {
  if (c.isBaby) return false;
  return c.currentTick - c.lastBreedTick >= BREED_COOLDOWN_TICKS;
}

export function inLoveMode(c: BreedCtx, ticksInLove: number): boolean {
  return canBreed(c) && ticksInLove > 0;
}
