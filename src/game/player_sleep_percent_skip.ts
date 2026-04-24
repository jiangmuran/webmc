export const DEFAULT_PLAYERS_SLEEPING_PERCENTAGE = 100;

export interface SleepStats {
  totalPlayers: number;
  sleepingPlayers: number;
  percentageGameRule: number;
}

export function requiredCount(s: SleepStats): number {
  return Math.max(1, Math.ceil((s.totalPlayers * s.percentageGameRule) / 100));
}

export function enoughPlayersSleeping(s: SleepStats): boolean {
  return s.sleepingPlayers >= requiredCount(s);
}

export function progressPercent(s: SleepStats): number {
  const required = requiredCount(s);
  return Math.min(100, Math.round((s.sleepingPlayers / required) * 100));
}
