// Powder snow slowly freezes entities standing in it. Leather boots
// let the entity walk on top without sinking. Freezing → 5 dmg when
// fully frozen; dials back when warm block or lava nearby.

export const FREEZE_TICKS_MAX = 140;
export const FREEZE_DAMAGE_PER_INTERVAL = 1;
export const FREEZE_DAMAGE_INTERVAL_TICKS = 40;

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

export function frostDamageThisTick(s: FreezeState, sinceLastDamageTicks: number): number {
  if (!isFrozen(s)) return 0;
  if (sinceLastDamageTicks < FREEZE_DAMAGE_INTERVAL_TICKS) return 0;
  return FREEZE_DAMAGE_PER_INTERVAL;
}

export function walkOnTopWithLeatherBoots(bootItem: string): boolean {
  return bootItem.startsWith('leather_boots');
}
