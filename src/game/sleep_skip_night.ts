export interface SleepState {
  totalPlayers: number;
  sleepingPlayers: number;
  requiredFraction: number;
}

export function requiredSleepers(s: SleepState): number {
  return Math.max(1, Math.ceil(s.totalPlayers * s.requiredFraction));
}

export function shouldSkipNight(s: SleepState): boolean {
  return s.sleepingPlayers >= requiredSleepers(s);
}

export function setTimeAfterSkip(): number {
  return 1000;
}
