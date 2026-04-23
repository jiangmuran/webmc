export const MAX_CHARGE_TICKS = 20;
export const MAX_VELOCITY = 3;
export const BASE_DAMAGE = 1;
export const MAX_DAMAGE = 10;

export function chargeFraction(ticks: number): number {
  return Math.min(1, Math.max(0, ticks / MAX_CHARGE_TICKS));
}

export function arrowVelocity(ticks: number): number {
  const f = chargeFraction(ticks);
  const v = (f * f + f * 2) / 3;
  return Math.min(MAX_VELOCITY, v * MAX_VELOCITY);
}

export function arrowDamage(ticks: number, powerLevel: number): number {
  const fullyCharged = chargeFraction(ticks) >= 1;
  const base = fullyCharged ? MAX_DAMAGE : BASE_DAMAGE + Math.floor(chargeFraction(ticks) * 6);
  return base + powerLevel * 0.5;
}

export function critChance(ticks: number): number {
  return chargeFraction(ticks) >= 1 ? 0.25 : 0;
}
