// Baby animal growth. Pups take ~20 minutes (24000 ticks) to mature;
// feeding them their food item shaves 10% off the remaining time.

export interface Pup {
  ageTicksRemaining: number; // 0 = adult
}

export const GROW_TICKS = 24000;
export const FEED_SPEEDUP = 0.1;

export function makePup(): Pup {
  return { ageTicksRemaining: GROW_TICKS };
}

export function tickGrow(p: Pup): boolean {
  if (p.ageTicksRemaining <= 0) return false;
  p.ageTicksRemaining -= 1;
  return p.ageTicksRemaining <= 0;
}

export function feed(p: Pup): boolean {
  if (p.ageTicksRemaining <= 0) return false;
  p.ageTicksRemaining = Math.max(0, p.ageTicksRemaining - Math.floor(GROW_TICKS * FEED_SPEEDUP));
  return p.ageTicksRemaining <= 0;
}

export function isAdult(p: Pup): boolean {
  return p.ageTicksRemaining <= 0;
}

// Some babies run away when hurt (unlike adults).
export function fleesOnDamage(adult: boolean): boolean {
  return !adult;
}
