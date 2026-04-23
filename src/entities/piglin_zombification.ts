// Piglins zombify after 15s in the overworld or end.

export const ZOMBIFICATION_TICKS = 300;

export interface PiglinCtx {
  dimension: 'overworld' | 'nether' | 'the_end';
  ticksOutsideNether: number;
}

export function isZombifying(c: PiglinCtx): boolean {
  return c.dimension !== 'nether';
}

export function tick(c: PiglinCtx): PiglinCtx {
  if (!isZombifying(c)) return { ...c, ticksOutsideNether: 0 };
  return { ...c, ticksOutsideNether: c.ticksOutsideNether + 1 };
}

export function becomeZombified(c: PiglinCtx): boolean {
  return isZombifying(c) && c.ticksOutsideNether >= ZOMBIFICATION_TICKS;
}

export function convertsInto(): string {
  return 'zombified_piglin';
}

export function canCureZombifiedPiglin(): boolean {
  return false; // no cure mechanic in MC
}
