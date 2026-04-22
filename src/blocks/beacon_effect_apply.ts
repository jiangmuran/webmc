// Beacon effect application. Once a beacon has a pyramid + primary
// (and optionally secondary), it applies that effect to players
// within range every 4 seconds (level II or I depending on secondary).

export type BeaconEffect =
  | 'speed'
  | 'haste'
  | 'resistance'
  | 'jump_boost'
  | 'strength'
  | 'regeneration';

export interface BeaconConfig {
  level: number; // 1..4
  primary: BeaconEffect | null;
  secondary: BeaconEffect | null;
}

export function allowedPrimariesForLevel(level: number): BeaconEffect[] {
  if (level < 1) return [];
  const out: BeaconEffect[] = ['speed', 'haste'];
  if (level >= 2) out.push('resistance', 'jump_boost');
  if (level >= 3) out.push('strength');
  return out;
}

export function allowsSecondary(level: number): boolean {
  return level >= 4;
}

export function secondaryOptions(primary: BeaconEffect | null): BeaconEffect[] {
  if (!primary) return [];
  // Regeneration is the secondary-exclusive choice; otherwise you can pick
  // primary as secondary to upgrade amplifier.
  return ['regeneration', primary];
}

export interface ApplyQuery {
  beacon: BeaconConfig;
  playerDistance: number;
  radius: number;
}

export interface ApplyResult {
  effect: BeaconEffect | null;
  amplifier: number;
  durationTicks: number;
}

export const EFFECT_DURATION_TICKS = 180; // 9s; refreshed every 4s
export const REFRESH_INTERVAL_TICKS = 80;

export function effectAt(q: ApplyQuery): ApplyResult {
  if (q.playerDistance > q.radius) {
    return { effect: null, amplifier: 0, durationTicks: 0 };
  }
  if (!q.beacon.primary) return { effect: null, amplifier: 0, durationTicks: 0 };
  const upgraded = q.beacon.secondary !== null && q.beacon.secondary === q.beacon.primary;
  return {
    effect: q.beacon.primary,
    amplifier: upgraded ? 1 : 0,
    durationTicks: EFFECT_DURATION_TICKS,
  };
}
