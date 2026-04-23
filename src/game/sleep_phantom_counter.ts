export interface SleepState {
  nightsWithoutSleep: number;
}

export const PHANTOM_THRESHOLD_NIGHTS = 3;

export function canPhantomSpawn(s: SleepState): boolean {
  return s.nightsWithoutSleep >= PHANTOM_THRESHOLD_NIGHTS;
}

export function resetOnSleep(_s: SleepState): SleepState {
  return { nightsWithoutSleep: 0 };
}

export function tickNightlyRollover(s: SleepState): SleepState {
  return { nightsWithoutSleep: s.nightsWithoutSleep + 1 };
}
