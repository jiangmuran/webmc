// Goat ram. Charges a target, then rams. 30-60s cooldown per ram.
// Screaming goat rams 50% more often. Ram breaks rammable blocks.

export interface Goat {
  isScreaming: boolean;
  lastRamMs: number;
  ramTargetId: string | null;
  ramStartMs: number;
}

// Wiki: normal goat rams every 30s-300s. Screaming goat rams every
// 1.5s-7.5s — about 33x faster (well-documented "annoying screaming
// goat" feature). Code had regular 30-60s + scream halved (~2x faster)
// — neither matches wiki. Fixed both bounds + screaming multiplier.
export const RAM_COOLDOWN_MIN_MS = 30_000;
export const RAM_COOLDOWN_MAX_MS = 300_000;
// 1/33 ≈ 0.03 to match wiki's 33x faster screaming ram.
export const SCREAM_MULT = 0.03;
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
