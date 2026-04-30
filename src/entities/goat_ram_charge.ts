// Goat ram. Charges a target, then rams. 30-60s cooldown per ram.
// Screaming goat rams 50% more often. Ram breaks rammable blocks.

export interface Goat {
  isScreaming: boolean;
  lastRamMs: number;
  ramTargetId: string | null;
  ramStartMs: number;
}

// Wiki (minecraft.wiki/w/Goat#Ramming):
//   Normal goat:    ram every 30 s to 300 s (5 min)
//   Screaming goat: ram every 1.5 s to 7.5 s
//
// Old code treated screaming as a multiplier (0.03) applied to the
// normal 30-300 s range, yielding 0.9-9 s — close to but missing
// the wiki 1.5-7.5 s bounds (lower bound 0.6 s shy of canon, upper
// bound 1.5 s over). Sibling goat_ram.ts already uses the explicit
// 1.5-7.5 s screaming bounds; this module now matches.
export const RAM_COOLDOWN_MIN_MS = 30_000;
export const RAM_COOLDOWN_MAX_MS = 300_000;
export const SCREAMING_COOLDOWN_MIN_MS = 1_500;
export const SCREAMING_COOLDOWN_MAX_MS = 7_500;
// Legacy multiplier kept for callers that imported it.
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
