// Powder snow slowly freezes entities standing in it. Leather boots
// let the entity walk on top without sinking. After 140 ticks (7s) of
// continuous exposure, fully-frozen entities take 1 HP every 40 ticks
// (2s); skeletons take 5 HP. Wiki: minecraft.wiki/w/Powder_Snow.

export const FREEZE_TICKS_MAX = 140;
export const FREEZE_DAMAGE_PER_INTERVAL = 1;
export const FREEZE_DAMAGE_INTERVAL_TICKS = 40;
// Wiki: skeletons take 5 HP/2s instead of the standard 1 HP/2s.
export const SKELETON_FREEZE_DAMAGE_PER_INTERVAL = 5;

export interface FreezeState {
  ticks: number;
}

export function inPowderSnow(s: FreezeState): FreezeState {
  return { ticks: Math.min(FREEZE_TICKS_MAX, s.ticks + 1) };
}

export function warmed(s: FreezeState): FreezeState {
  return { ticks: Math.max(0, s.ticks - 2) };
}

export function isFrozen(s: FreezeState): boolean {
  return s.ticks >= FREEZE_TICKS_MAX;
}

export function frostDamageThisTick(
  s: FreezeState,
  sinceLastDamageTicks: number,
  isSkeleton = false,
): number {
  if (!isFrozen(s)) return 0;
  if (sinceLastDamageTicks < FREEZE_DAMAGE_INTERVAL_TICKS) return 0;
  return isSkeleton ? SKELETON_FREEZE_DAMAGE_PER_INTERVAL : FREEZE_DAMAGE_PER_INTERVAL;
}

export function walkOnTopWithLeatherBoots(bootItem: string): boolean {
  return bootItem.startsWith('leather_boots');
}
