// Husk: desert zombie variant. Drowning in water converts to zombie
// after 30s immersion. Bites inflict Hunger.

export const HUSK_HUNGER_DURATION_TICKS = 140;
export const HUSK_HUNGER_DURATION_HARD = 300;
export const HUSK_DROWN_TICKS = 600;

export interface HuskState {
  immersionTicks: number;
}

export function onBiteHunger(difficulty: 'normal' | 'hard'): number {
  return difficulty === 'hard' ? HUSK_HUNGER_DURATION_HARD : HUSK_HUNGER_DURATION_TICKS;
}

export function drowns(s: HuskState): boolean {
  return s.immersionTicks >= HUSK_DROWN_TICKS;
}

export function underwaterTick(s: HuskState, inWater: boolean): HuskState {
  if (!inWater) return { immersionTicks: 0 };
  return { immersionTicks: s.immersionTicks + 1 };
}

export function convertsInto(): string {
  return 'zombie';
}

export function burnsInSun(): boolean {
  return false;
}
