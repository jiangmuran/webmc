export const DEFAULT_IMMUNE_TICKS = 10;

export interface ImmunityCtx {
  lastHitTick: number;
  currentTick: number;
}

export function isImmune(c: ImmunityCtx, immuneTicks = DEFAULT_IMMUNE_TICKS): boolean {
  return c.currentTick - c.lastHitTick < immuneTicks;
}

export function canTakeNewHit(c: ImmunityCtx): boolean {
  return !isImmune(c);
}
