// Powder snow freezing. Standing in powder snow builds up a freeze meter;
// wearing leather armor resists. Once the meter hits 140 ticks (7s), the
// player takes 1 HP / 2 s of frost damage.

export interface FreezingState {
  ticks: number; // 0..140 when fully frozen
  damageCooldownSec: number;
}

const FREEZE_MAX = 140;
const FREEZE_TICKS_PER_SEC = 20;
const THAW_RATE_PER_SEC = 40;

export function makeFreezingState(): FreezingState {
  return { ticks: 0, damageCooldownSec: 0 };
}

export interface FreezingQuery {
  inPowderSnow: boolean;
  leatherArmorCount: number; // 0..4 leather pieces resist freezing
}

export interface FreezingResult {
  damage: number;
  frozenFraction: number; // 0..1 for HUD overlay
}

export function tickFreezing(
  state: FreezingState,
  dtSec: number,
  q: FreezingQuery,
): FreezingResult {
  if (q.inPowderSnow && q.leatherArmorCount < 4) {
    state.ticks = Math.min(FREEZE_MAX + 100, state.ticks + FREEZE_TICKS_PER_SEC * dtSec);
  } else {
    state.ticks = Math.max(0, state.ticks - THAW_RATE_PER_SEC * dtSec);
  }
  let damage = 0;
  if (state.ticks >= FREEZE_MAX) {
    state.damageCooldownSec -= dtSec;
    if (state.damageCooldownSec <= 0) {
      damage = 1;
      state.damageCooldownSec = 2;
    }
  } else {
    state.damageCooldownSec = 0;
  }
  return { damage, frozenFraction: Math.min(1, state.ticks / FREEZE_MAX) };
}
