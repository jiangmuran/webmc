// Pufferfish inflates in 3 stages when threat approaches; damages
// + poisons entities that touch it. Deflates when threat gone.
//
// Wiki (minecraft.wiki/w/Pufferfish): "Going near a semi-puffed or
// fully puffed pufferfish inflicts the player/mob with three or
// six seconds of Poison based on the inflation level." So:
//   semi-puffed (state 1): Poison I, 3 s = 60 ticks
//   fully puffed (state 2): Poison I, 6 s = 120 ticks
//
// Old POISON_TICKS = 140 (7 s) didn't match either wiki value, and
// POISON_AMPLIFIER = 1 (Poison II) was one level too high — the
// wiki shows just "Poison" with no level, which is amplifier 0.

export const PUFFER_DETECT_RADIUS = 2;
export const POISON_AMPLIFIER = 0;
export const POISON_TICKS_SEMI = 60; // 3 s
export const POISON_TICKS_FULL = 120; // 6 s

// Back-compat constant: callers that took a single duration value
// previously used 140 ticks; now points at the fully-puffed wiki
// value (120). Prefer poisonDurationTicks(state) for state-aware
// lookups.
export const POISON_TICKS = POISON_TICKS_FULL;

export type PufferState = 0 | 1 | 2; // 0 deflated, 1 half, 2 full

export function poisonDurationTicks(state: PufferState): number {
  if (state === 1) return POISON_TICKS_SEMI;
  if (state === 2) return POISON_TICKS_FULL;
  return 0;
}

export interface PufferCtx {
  state: PufferState;
  threatNearby: boolean;
}

export function transition(c: PufferCtx): PufferCtx {
  if (c.threatNearby) {
    if (c.state < 2) return { ...c, state: (c.state + 1) as PufferState };
    return c;
  }
  if (c.state > 0) return { ...c, state: (c.state - 1) as PufferState };
  return c;
}

export function contactDamage(state: PufferState): number {
  if (state === 0) return 0;
  if (state === 1) return 1;
  return 2;
}

export function contactPoison(state: PufferState): boolean {
  return state >= 1;
}

export function fullyInflated(c: PufferCtx): boolean {
  return c.state === 2;
}
