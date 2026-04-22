// Allay duplication. When an allay dances near a jukebox playing a
// disc, giving it an amethyst shard causes it to duplicate after ~5s.
// Duplication has a 5-minute cooldown per allay.

export interface AllayState {
  lastDupeAtMs: number;
  dancing: boolean;
  holdingShardSinceMs: number | null;
}

export const DUP_COOLDOWN_MS = 5 * 60_000;
export const DUP_HOLD_MS = 5000;

export function makeAllay(): AllayState {
  return { lastDupeAtMs: -Infinity, dancing: false, holdingShardSinceMs: null };
}

export function startDancing(s: AllayState): void {
  s.dancing = true;
}

export function stopDancing(s: AllayState): void {
  s.dancing = false;
  s.holdingShardSinceMs = null;
}

export function giveShard(s: AllayState, nowMs: number): boolean {
  if (!s.dancing) return false;
  s.holdingShardSinceMs = nowMs;
  return true;
}

export interface TickResult {
  duplicated: boolean;
}

export function tickAllay(s: AllayState, nowMs: number): TickResult {
  if (!s.dancing || s.holdingShardSinceMs === null) {
    return { duplicated: false };
  }
  if (nowMs - s.holdingShardSinceMs < DUP_HOLD_MS) {
    return { duplicated: false };
  }
  if (nowMs - s.lastDupeAtMs < DUP_COOLDOWN_MS) {
    s.holdingShardSinceMs = null;
    return { duplicated: false };
  }
  s.lastDupeAtMs = nowMs;
  s.holdingShardSinceMs = null;
  return { duplicated: true };
}
