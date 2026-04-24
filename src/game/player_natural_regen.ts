export interface RegenInput {
  food: number;
  saturation: number;
  health: number;
  maxHealth: number;
  ticksSinceLastRegen: number;
  peacefulDifficulty: boolean;
}

export const FAST_REGEN_SATURATION = 20;
export const FAST_REGEN_TICK_INTERVAL = 10;
export const REGEN_TICK_INTERVAL = 80;
export const PEACEFUL_REGEN_TICK_INTERVAL = 20;

export function intervalFor(i: RegenInput): number {
  if (i.peacefulDifficulty) return PEACEFUL_REGEN_TICK_INTERVAL;
  if (i.food >= FAST_REGEN_SATURATION && i.saturation > 0) return FAST_REGEN_TICK_INTERVAL;
  return REGEN_TICK_INTERVAL;
}

export function canRegen(i: RegenInput): boolean {
  if (i.health >= i.maxHealth) return false;
  if (i.peacefulDifficulty) return true;
  return i.food >= 18;
}

export function shouldHealThisTick(i: RegenInput): boolean {
  if (!canRegen(i)) return false;
  return i.ticksSinceLastRegen >= intervalFor(i);
}

export function exhaustionAfterHeal(i: RegenInput): number {
  if (i.food >= FAST_REGEN_SATURATION && i.saturation > 0) return 6;
  return i.peacefulDifficulty ? 0 : 6;
}
