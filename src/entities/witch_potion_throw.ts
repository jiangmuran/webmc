// Witch behavior. Throws splash potions at targets; drinks self-buff
// potions when hurt. Cooldown 2.5s between throws.

export type OffensivePotion = 'poison' | 'slowness' | 'weakness' | 'harming';
export type DefensivePotion = 'healing' | 'fire_resistance' | 'water_breathing' | 'speed';

export interface WitchState {
  hp: number;
  maxHp: number;
  lastThrowMs: number;
  drinkingUntilMs: number;
}

export const THROW_COOLDOWN_MS = 2500;
export const DRINK_DURATION_MS = 1600;

export function makeWitch(): WitchState {
  return { hp: 26, maxHp: 26, lastThrowMs: -Infinity, drinkingUntilMs: 0 };
}

export function isDrinking(w: WitchState, nowMs: number): boolean {
  return nowMs < w.drinkingUntilMs;
}

export interface ThrowQuery {
  nowMs: number;
  targetInRange: boolean;
  rand: () => number;
}

export function tryThrow(w: WitchState, q: ThrowQuery): OffensivePotion | null {
  if (!q.targetInRange) return null;
  if (isDrinking(w, q.nowMs)) return null;
  if (q.nowMs - w.lastThrowMs < THROW_COOLDOWN_MS) return null;
  w.lastThrowMs = q.nowMs;
  const r = q.rand();
  if (r < 0.25) return 'poison';
  if (r < 0.5) return 'slowness';
  if (r < 0.75) return 'weakness';
  return 'harming';
}

export interface DrinkQuery {
  nowMs: number;
  hp: number;
  nearbyFireDamage: boolean;
  inWater: boolean;
  fleeing: boolean;
}

export function pickDefense(w: WitchState, q: DrinkQuery): DefensivePotion | null {
  if (isDrinking(w, q.nowMs)) return null;
  if (q.hp < w.maxHp * 0.5) return 'healing';
  if (q.nearbyFireDamage) return 'fire_resistance';
  if (q.inWater) return 'water_breathing';
  if (q.fleeing) return 'speed';
  return null;
}

export function startDrink(w: WitchState, nowMs: number): void {
  w.drinkingUntilMs = nowMs + DRINK_DURATION_MS;
}
