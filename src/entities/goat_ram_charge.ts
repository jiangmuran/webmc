// Goat ram. Charges a target, then rams. 30-60s cooldown per ram.
// Screaming goat rams 50% more often. Ram breaks rammable blocks.

export interface Goat {
  isScreaming: boolean;
  lastRamMs: number;
  ramTargetId: string | null;
  ramStartMs: number;
}

// Wiki (minecraft.wiki/w/Goat#Ramming):
//   Normal goat:    "Every 30 seconds to 5 minutes, a goat tries to ram"
//   Screaming goat: "tries to ram a valid target every 5 to 15 seconds"
//
// A prior commit recorded 1.5-7.5 s for screaming, ~3× too aggressive.
// Wiki-canonical screaming bounds are 5-15 s. Sibling goat_ram.ts
// carried the same wrong bounds; both now match wiki.
export const RAM_COOLDOWN_MIN_MS = 30_000;
export const RAM_COOLDOWN_MAX_MS = 300_000;
export const SCREAMING_COOLDOWN_MIN_MS = 5_000;
export const SCREAMING_COOLDOWN_MAX_MS = 15_000;
// Legacy multiplier kept for callers that imported it. Wiki ratio is
// approx 5/30..15/300 → 0.05..0.166; centered ≈ 0.1.
export const SCREAM_MULT = 0.1;
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
  const [min, max] = g.isScreaming
    ? [SCREAMING_COOLDOWN_MIN_MS, SCREAMING_COOLDOWN_MAX_MS]
    : [RAM_COOLDOWN_MIN_MS, RAM_COOLDOWN_MAX_MS];
  const cooldown = min + q.rand() * (max - min);
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
