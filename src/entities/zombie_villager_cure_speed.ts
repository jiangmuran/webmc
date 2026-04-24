export const BASE_CURE_TICKS = 20 * 60 * 4;

export interface CureInput {
  onIronBarsNearby: boolean;
  onBedNearby: boolean;
  regenII: boolean;
  weaknessApplied: boolean;
}

export function isCuring(i: CureInput): boolean {
  return i.regenII && i.weaknessApplied;
}

export function cureDurationTicks(i: CureInput): number | undefined {
  if (!isCuring(i)) return undefined;
  let speed = 1;
  if (i.onIronBarsNearby) speed *= 0.01;
  if (i.onBedNearby) speed *= 0.05;
  return Math.max(20, Math.floor(BASE_CURE_TICKS * speed));
}
