// Phantom spawn timer. Triggered by consecutive nights without sleeping.
// After 3 in-game days awake, phantoms may spawn in open-sky.

export const PHANTOM_INSOMNIA_DAYS_THRESHOLD = 3;
export const TICKS_PER_DAY = 24000;

export interface PhantomInsomnia {
  ticksSinceLastSleep: number;
}

export function awakeDays(p: PhantomInsomnia): number {
  return Math.floor(p.ticksSinceLastSleep / TICKS_PER_DAY);
}

export function eligibleToSpawn(p: PhantomInsomnia): boolean {
  return awakeDays(p) >= PHANTOM_INSOMNIA_DAYS_THRESHOLD;
}

export function spawnChance(p: PhantomInsomnia): number {
  if (!eligibleToSpawn(p)) return 0;
  const extraDays = awakeDays(p) - PHANTOM_INSOMNIA_DAYS_THRESHOLD;
  return Math.min(1, 0.05 + 0.02 * extraDays);
}

export function resetOnSleep(): PhantomInsomnia {
  return { ticksSinceLastSleep: 0 };
}

export function tick(p: PhantomInsomnia): PhantomInsomnia {
  return { ticksSinceLastSleep: p.ticksSinceLastSleep + 1 };
}
