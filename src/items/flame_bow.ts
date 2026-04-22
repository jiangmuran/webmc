// Flame (bow). Arrows ignite on shot and set struck entities on fire for 5s.

export const FLAME_FIRE_TICKS = 100;

export function arrowsOnFire(hasEnchant: boolean): boolean {
  return hasEnchant;
}

export function ignitionTicksOnHit(hasEnchant: boolean): number {
  return hasEnchant ? FLAME_FIRE_TICKS : 0;
}

export function compatibleWithInfinity(): boolean {
  return true;
}

// Flame + Power stacks normally.
export function compatibleWithPower(): boolean {
  return true;
}
