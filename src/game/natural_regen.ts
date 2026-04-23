export interface RegenState {
  hunger: number;
  saturation: number;
  hp: number;
  maxHp: number;
  ticksSinceLastRegen: number;
}

export const SATURATED_REGEN_INTERVAL = 10;
export const NORMAL_REGEN_INTERVAL = 80;
export const HUNGER_FLOOR = 18;

export function regenIntervalTicks(s: RegenState): number | undefined {
  if (s.hp >= s.maxHp) return undefined;
  if (s.hunger >= HUNGER_FLOOR && s.saturation > 0) return SATURATED_REGEN_INTERVAL;
  if (s.hunger >= HUNGER_FLOOR - 1) return NORMAL_REGEN_INTERVAL;
  return undefined;
}

export function shouldRegen(s: RegenState): boolean {
  const interval = regenIntervalTicks(s);
  if (interval === undefined) return false;
  return s.ticksSinceLastRegen >= interval;
}
