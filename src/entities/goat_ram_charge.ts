// Goat ram. Charges a target, then rams. 30-60s cooldown per ram.
// Screaming goat rams 50% more often. Ram breaks rammable blocks.

export interface Goat {
  isScreaming: boolean;
  lastRamMs: number;
  ramTargetId: string | null;
  ramStartMs: number;
}

export const RAM_COOLDOWN_MIN_MS = 30_000;
export const RAM_COOLDOWN_MAX_MS = 60_000;
export const SCREAM_MULT = 0.5;
export const CHARGE_DURATION_MS = 1000;

export function makeGoat(isScreaming = false): Goat {
  return { isScreaming, lastRamMs: -Infinity, ramTargetId: null, ramStartMs: 0 };
}

export interface RamQuery {
  nowMs: number;
  targetId: string | null;
  rand: () => number;
}

export function tryBeginRam(g: Goat, q: RamQuery): boolean {
  if (!q.targetId) return false;
  if (g.ramTargetId !== null) return false;
  const cooldown =
    (g.isScreaming ? SCREAM_MULT : 1) *
    (RAM_COOLDOWN_MIN_MS + q.rand() * (RAM_COOLDOWN_MAX_MS - RAM_COOLDOWN_MIN_MS));
  if (q.nowMs - g.lastRamMs < cooldown) return false;
  g.ramTargetId = q.targetId;
  g.ramStartMs = q.nowMs;
  return true;
}

export function ramTickDone(g: Goat, nowMs: number): boolean {
  if (g.ramTargetId === null) return false;
  if (nowMs - g.ramStartMs < CHARGE_DURATION_MS) return false;
  g.lastRamMs = nowMs;
  g.ramTargetId = null;
  return true;
}

// Horn drop on ram-break (20% per successful hit on hornable block).
export const HORN_DROP_CHANCE = 0.2;

export function hornDropsOnRam(rand: () => number): boolean {
  return rand() < HORN_DROP_CHANCE;
}
