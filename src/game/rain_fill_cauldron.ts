export interface CauldronCtx {
  currentLevel: number;
  maxLevel: number;
  isUnderOpenSky: boolean;
  isRaining: boolean;
  ticksSinceFill: number;
}

export const FILL_INTERVAL_TICKS = 1200;

export function shouldFill(c: CauldronCtx): boolean {
  if (!c.isUnderOpenSky || !c.isRaining) return false;
  if (c.currentLevel >= c.maxLevel) return false;
  return c.ticksSinceFill >= FILL_INTERVAL_TICKS;
}

export function levelAfterFill(c: CauldronCtx): number {
  return Math.min(c.maxLevel, c.currentLevel + 1);
}
