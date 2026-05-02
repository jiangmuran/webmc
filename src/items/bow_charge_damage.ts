export const MAX_CHARGE_TICKS = 20;
export const MAX_VELOCITY = 3;
export const BASE_DAMAGE = 1;
// Wiki (minecraft.wiki/w/Arrow): "Damage = ⌈velocity × 2⌉." At full
// charge, velocity = 3, so base damage = ceil(6) = 6 — NOT 10.
// Old MAX_DAMAGE = 10 conflated full-charge base with full-charge +
// critical (~6 + up to ~3 random). Sibling arrow_trajectory.ts
// (`damageFor`) computes the wiki value 6; this module had the
// number off by 67%.
export const MAX_DAMAGE = 6;

export function chargeFraction(ticks: number): number {
  return Math.min(1, Math.max(0, ticks / MAX_CHARGE_TICKS));
}

export function arrowVelocity(ticks: number): number {
  const f = chargeFraction(ticks);
  const v = (f * f + f * 2) / 3;
  return Math.min(MAX_VELOCITY, v * MAX_VELOCITY);
}

// Wiki (minecraft.wiki/w/Power): "Power adds 25% × (Power level + 1)
// extra damage, rounded up to the nearest half-heart, then added to
// the base damage." So bonus = ceil(0.25 × (level + 1) × base) — at
// Power V on a fully-charged bow, that's ceil(0.25 × 6 × 6) = 9
// extra, total 15.
//
// Old formula `base + powerLevel * 0.5` added a tiny flat bonus (0.5
// per level, max 2.5 at Power V) — about 17% of the wiki value at
// Power V. Sibling arrow_trajectory.ts (`damageFor`) and
// arrow_critical.ts already use the wiki ceil-of-percentage formula.
export function arrowDamage(ticks: number, powerLevel: number): number {
  const fullyCharged = chargeFraction(ticks) >= 1;
  const base = fullyCharged ? MAX_DAMAGE : BASE_DAMAGE + Math.floor(chargeFraction(ticks) * 5);
  if (powerLevel <= 0) return base;
  return base + Math.ceil(0.25 * (powerLevel + 1) * base);
}

export function critChance(ticks: number): number {
  return chargeFraction(ticks) >= 1 ? 0.25 : 0;
}
