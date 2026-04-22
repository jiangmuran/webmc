// Curing a zombie villager. Hit with a weakness splash + apple, a
// zombie villager enters a "curing" state that takes ~3-5 minutes.
// During curing it shakes. Iron bars or beds nearby speed it up.

export interface CuringState {
  startTick: number;
  baseDurationTicks: number;
  speedUpFactors: number; // sum of bed/iron bonuses (0..)
}

export const BASE_CURE_TICKS = 3600; // 3 min @ 20 Hz

export function startCure(nowTick: number): CuringState {
  return { startTick: nowTick, baseDurationTicks: BASE_CURE_TICKS, speedUpFactors: 0 };
}

export function addBedOrBars(s: CuringState, count: number): void {
  s.speedUpFactors += count * 0.05;
}

export function remainingTicks(s: CuringState, nowTick: number): number {
  const effective = s.baseDurationTicks * Math.max(0.1, 1 - s.speedUpFactors);
  const elapsed = nowTick - s.startTick;
  return Math.max(0, Math.floor(effective - elapsed));
}

export function isCured(s: CuringState, nowTick: number): boolean {
  return remainingTicks(s, nowTick) === 0;
}
