export interface DragonState {
  hpPercent: number;
  allCrystalsDestroyed: boolean;
  ticksInAir: number;
}

export const PERCH_HP_THRESHOLD = 0.3;
export const PERCH_AFTER_AIR_TICKS = 1200;

export function shouldPerch(s: DragonState): boolean {
  if (!s.allCrystalsDestroyed) return false;
  return s.hpPercent <= PERCH_HP_THRESHOLD || s.ticksInAir >= PERCH_AFTER_AIR_TICKS;
}

export function breathAttackDurationTicks(): number {
  return 200;
}
