// Multiplayer sleep voting. The playersSleepingPercentage gamerule (0..100)
// controls how many players must be in bed to skip the night. Default is
// 100 in MC 1.17+; setting it lower allows partial sleep.

export interface SleepVoteQuery {
  playersSleepingPercentage: number; // 0..100
  onlinePlayers: number;
  sleepingPlayers: number;
  skipWeather: boolean; // clear weather on skip
}

export interface SleepVoteResult {
  shouldSkip: boolean;
  threshold: number;
  effectiveVoters: number;
}

export function evaluateSleepVote(q: SleepVoteQuery): SleepVoteResult {
  if (q.onlinePlayers === 0) return { shouldSkip: false, threshold: 0, effectiveVoters: 0 };
  const pct = Math.max(0, Math.min(100, q.playersSleepingPercentage));
  // In MC, "threshold 0" makes any sleeper skip; otherwise threshold =
  // ceil(pct/100 × players).
  const threshold = pct === 0 ? 1 : Math.ceil((pct / 100) * q.onlinePlayers);
  return {
    shouldSkip: q.sleepingPlayers >= threshold,
    threshold,
    effectiveVoters: q.sleepingPlayers,
  };
}

// When skip triggers, the time advances from current to dawn and any
// thunderstorm/rain is cleared iff the skipWeather rule is true.
export interface TimeSkipResult {
  newTimeOfDay: number; // 0.0 = dawn
  clearedWeather: boolean;
}

export function performTimeSkip(skipWeather: boolean): TimeSkipResult {
  return { newTimeOfDay: 0, clearedWeather: skipWeather };
}
