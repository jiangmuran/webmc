// Wiki (minecraft.wiki/w/Zombie_Villager#Curing): cure starts when
// weakness is applied AND a (non-enchanted) golden apple is used.
// Old `regenII` trigger was nowhere in the wiki — the cured zombie
// gains Strength during conversion (not Regeneration II), and the
// trigger to start curing is golden apple, not Regen II.
//
// Cure time: random integer between 3600 and 6000 ticks. We keep
// 4800 (the midpoint) as a deterministic constant for callers that
// don't pass an rng; rollCureDuration() returns the wiki-canonical
// random duration.
//
// Accelerants: each iron bar / bed half within a 9³ cube counts as
// one (cap 14). Each contributes 0.3% speedup, capping at 4.2%
// total (wiki). Old code multiplied duration by 0.01/0.05 (giving
// 95–99% speedup on a single block — 20–25× faster than wiki).
export const BASE_CURE_TICKS = 4800;
export const BASE_CURE_MIN_TICKS = 3600;
export const BASE_CURE_MAX_TICKS = 6000;
export const ACCELERANT_CAP = 14;
export const MAX_SPEEDUP = 0.042;

export interface CureInput {
  ironBarsNearby: number;
  bedHalvesNearby: number;
  weaknessApplied: boolean;
  goldenAppleUsed: boolean;
}

export function isCuring(i: CureInput): boolean {
  return i.weaknessApplied && i.goldenAppleUsed;
}

export function rollCureDuration(rng: () => number = Math.random): number {
  return BASE_CURE_MIN_TICKS + Math.floor(rng() * (BASE_CURE_MAX_TICKS - BASE_CURE_MIN_TICKS + 1));
}

export function cureDurationTicks(i: CureInput, baseTicks = BASE_CURE_TICKS): number | undefined {
  if (!isCuring(i)) return undefined;
  const accel = Math.min(ACCELERANT_CAP, i.ironBarsNearby + i.bedHalvesNearby);
  const speedup = (accel / ACCELERANT_CAP) * MAX_SPEEDUP;
  return Math.max(20, Math.floor(baseTicks * (1 - speedup)));
}
