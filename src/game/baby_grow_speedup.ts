export interface BabyState {
  ageTicks: number;
  isBaby: boolean;
}

export const GROW_TICKS_DEFAULT = 20 * 20 * 60;

const BREEDING_ITEM_SPEEDUP_TICKS = 200;

export function feed(s: BabyState): BabyState {
  if (!s.isBaby) return s;
  return { ...s, ageTicks: s.ageTicks + BREEDING_ITEM_SPEEDUP_TICKS };
}

export function tick(s: BabyState): BabyState {
  if (!s.isBaby) return s;
  const next = s.ageTicks + 1;
  if (next >= GROW_TICKS_DEFAULT) return { ageTicks: 0, isBaby: false };
  return { ...s, ageTicks: next };
}

export function growFraction(s: BabyState): number {
  if (!s.isBaby) return 1;
  return Math.min(1, s.ageTicks / GROW_TICKS_DEFAULT);
}
