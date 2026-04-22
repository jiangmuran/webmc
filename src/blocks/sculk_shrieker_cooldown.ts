// Sculk shrieker cooldown. A shriek raises Darkness in nearby players
// and contributes to warden summoning. Has 90-tick cooldown between
// shrieks from the same source.

export interface Shrieker {
  lastShriekTick: number;
  canSummon: boolean; // only naturally-placed shriekers
}

export const SHRIEK_COOLDOWN_TICKS = 90;
export const DARKNESS_RADIUS = 40;
export const WARNING_LEVEL_MAX = 4;

export interface ShriekQuery {
  nowTick: number;
  detectedVibration: boolean;
}

export interface ShriekResult {
  shrieked: boolean;
  nextWarningLevel: number;
}

export function tryShriek(s: Shrieker, q: ShriekQuery, currentWarning: number): ShriekResult {
  if (!q.detectedVibration) return { shrieked: false, nextWarningLevel: currentWarning };
  if (q.nowTick - s.lastShriekTick < SHRIEK_COOLDOWN_TICKS) {
    return { shrieked: false, nextWarningLevel: currentWarning };
  }
  s.lastShriekTick = q.nowTick;
  return {
    shrieked: true,
    nextWarningLevel: Math.min(WARNING_LEVEL_MAX, currentWarning + 1),
  };
}

// If warning level reaches max, summon warden (if canSummon).
export function shouldSummonWarden(s: Shrieker, warning: number): boolean {
  return s.canSummon && warning >= WARNING_LEVEL_MAX;
}

// Darkness duration scales with warning level.
export function darknessDurationTicks(warningLevel: number): number {
  return 200 + warningLevel * 60;
}
