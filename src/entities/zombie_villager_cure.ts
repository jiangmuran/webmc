// Curing a zombie villager. Hit with a weakness splash + apple, a
// zombie villager enters a "curing" state. During curing it shakes.
// Iron bars or beds (each half counted separately) within a 9×9×9
// cube around the villager speed it up.
//
// Wiki (minecraft.wiki/w/Zombie_Villager#Curing): "Time to cure is
// initially a random integer between 3600 and 6000 ticks (180 to
// 300 seconds, 3 to 5 minutes). … For each one found up to 14,
// there is a 30% chance of decreasing the countdown timer by 1
// more tick. Therefore, having at least 14 half-beds and/or iron
// bars within range speeds up conversion by an average of 4.2%."
//
// Old code locked the duration at 3600 (only the floor of the
// 3600-6000 range) and gave each accelerant a 5% speed-up — at
// just 14 accelerants that summed to 70% (vs wiki 4.2%), and a
// trivial 2-iron-bar set already cured the villager 16× faster
// than wiki canon.

export interface CuringState {
  startTick: number;
  baseDurationTicks: number;
  accelerantCount: number; // beds + iron bars in 9³ cube, capped at 14
}

export const BASE_CURE_MIN_TICKS = 3600;
export const BASE_CURE_MAX_TICKS = 6000;
export const ACCELERANT_CAP = 14;
export const MAX_SPEEDUP = 0.042;

export function startCure(nowTick: number, rng: () => number = Math.random): CuringState {
  const dur =
    BASE_CURE_MIN_TICKS + Math.floor(rng() * (BASE_CURE_MAX_TICKS - BASE_CURE_MIN_TICKS + 1));
  return { startTick: nowTick, baseDurationTicks: dur, accelerantCount: 0 };
}

export function addBedOrBars(s: CuringState, count: number): void {
  s.accelerantCount = Math.min(ACCELERANT_CAP, s.accelerantCount + count);
}

export function remainingTicks(s: CuringState, nowTick: number): number {
  const speedup = (s.accelerantCount / ACCELERANT_CAP) * MAX_SPEEDUP;
  const effective = s.baseDurationTicks * (1 - speedup);
  const elapsed = nowTick - s.startTick;
  return Math.max(0, Math.floor(effective - elapsed));
}

export function isCured(s: CuringState, nowTick: number): boolean {
  return remainingTicks(s, nowTick) === 0;
}
