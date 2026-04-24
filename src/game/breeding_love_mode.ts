export const LOVE_MODE_TICKS = 600;
export const BREEDING_COOLDOWN_TICKS = 6000;

export interface BreedableState {
  id: string;
  entityType: string;
  loveModeTicks: number;
  lastBredAt: number;
  isBaby: boolean;
}

export function enterLoveMode(s: BreedableState): BreedableState {
  if (s.isBaby) return s;
  return { ...s, loveModeTicks: LOVE_MODE_TICKS };
}

export function canBreed(a: BreedableState, b: BreedableState, nowTicks: number): boolean {
  if (a.isBaby || b.isBaby) return false;
  if (a.entityType !== b.entityType) return false;
  if (a.loveModeTicks <= 0 || b.loveModeTicks <= 0) return false;
  return (
    nowTicks - a.lastBredAt >= BREEDING_COOLDOWN_TICKS &&
    nowTicks - b.lastBredAt >= BREEDING_COOLDOWN_TICKS
  );
}

export function onBreedComplete(
  a: BreedableState,
  b: BreedableState,
  nowTicks: number,
): { a: BreedableState; b: BreedableState } {
  return {
    a: { ...a, loveModeTicks: 0, lastBredAt: nowTicks },
    b: { ...b, loveModeTicks: 0, lastBredAt: nowTicks },
  };
}
