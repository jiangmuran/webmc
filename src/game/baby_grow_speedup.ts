export interface BabyState {
  ageTicks: number;
  isBaby: boolean;
}

export const GROW_TICKS_DEFAULT = 20 * 20 * 60;

// Wiki: feeding a baby animal advances age by 10% of REMAINING time,
// not a flat speedup. Was a flat +200 ticks (~0.83% of total) which
// took ~120 feeds to mature a baby instead of vanilla's ~22 feeds.
export function feed(s: BabyState): BabyState {
  if (!s.isBaby) return s;
  const remaining = Math.max(0, GROW_TICKS_DEFAULT - s.ageTicks);
  return { ...s, ageTicks: s.ageTicks + Math.floor(remaining * 0.1) };
}

// In-place mutation. Was returning a fresh {...s, ageTicks: next}
// per call — main.ts ticks every baby mob × ticksThisFrame per
// frame, so a busy farm with 10 baby mobs at 60fps allocated 600+
// throwaway BabyState objects per second. Caller stores back the
// returned reference (which is `s`), so observable behavior is
// identical to the previous immutable contract.
export function tick(s: BabyState): BabyState {
  if (!s.isBaby) return s;
  s.ageTicks += 1;
  if (s.ageTicks >= GROW_TICKS_DEFAULT) {
    s.ageTicks = 0;
    s.isBaby = false;
  }
  return s;
}

export function growFraction(s: BabyState): number {
  if (!s.isBaby) return 1;
  return Math.min(1, s.ageTicks / GROW_TICKS_DEFAULT);
}
