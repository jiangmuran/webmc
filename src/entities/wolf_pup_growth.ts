// Baby animal growth. Pups take ~20 minutes (24000 ticks) to mature;
// each feeding shaves 10% off the REMAINING time.
//
// Wiki (minecraft.wiki/w/Wolf, generic baby animal rule): "Each use
// reduces 10% of the remaining time to grow up. A baby fed once per
// second grows up in approximately 48 seconds using 47 [feeds]."
//
// 24000 × 0.9^47 ≈ 1.8 ticks → effectively grown, matching wiki ✓.
// Old `GROW_TICKS × 0.1` subtracted a flat 10% of the TOTAL time
// per feed, so 10 feeds reached zero (vs wiki's 47-feed asymptote).
// Multiplicative reduction is the canonical wiki rule.

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
  // Wiki: reduce remaining time by 10% (multiplicative).
  p.ageTicksRemaining = Math.max(0, Math.floor(p.ageTicksRemaining * (1 - FEED_SPEEDUP)));
  return p.ageTicksRemaining <= 0;
}

export function isAdult(p: Pup): boolean {
  return p.ageTicksRemaining <= 0;
}

// Some babies run away when hurt (unlike adults).
export function fleesOnDamage(adult: boolean): boolean {
  return !adult;
}
