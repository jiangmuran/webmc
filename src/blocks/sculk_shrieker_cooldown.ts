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

// Wiki (minecraft.wiki/w/Sculk_Shrieker): "After the shrieking ends,
// all players in Survival or Adventure mode within 40 blocks are
// given the Darkness effect for 12 seconds." Duration is a fixed
// 240 ticks (12s) regardless of warning level — old `200 + wl*60`
// scaled with warning level, which the wiki specifically does not
// do (the warning level controls subtitles + warden summon, not the
// Darkness window itself). Parameter kept for now to avoid an API
// break while callers are wired in M-later.
export function darknessDurationTicks(warningLevel: number): number {
  void warningLevel;
  return 240;
}
