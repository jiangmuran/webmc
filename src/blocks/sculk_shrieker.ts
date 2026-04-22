// Sculk shrieker. Shrieks when activated by sound / sensor; after 4
// shrieks of the same player within a time window, summons a warden.

export interface SculkShriekerState {
  shriekCountsByPlayer: Map<string, number>;
  lastShriekTimes: Map<string, number>;
  resetAfterSec: number;
}

const SHRIEKS_FOR_WARDEN = 4;
const RESET_SEC = 200; // ~3.3 min warning timer

export function makeShrieker(): SculkShriekerState {
  return {
    shriekCountsByPlayer: new Map(),
    lastShriekTimes: new Map(),
    resetAfterSec: RESET_SEC,
  };
}

export interface ShriekResult {
  warningLevel: number; // 1..4
  summonWarden: boolean;
}

// Called when the shrieker activates from a vibration. `nowSec` is the
// current game time; returns whether this shriek summons a warden.
export function shriek(state: SculkShriekerState, playerId: string, nowSec: number): ShriekResult {
  const last = state.lastShriekTimes.get(playerId) ?? 0;
  if (nowSec - last > state.resetAfterSec) {
    state.shriekCountsByPlayer.set(playerId, 0);
  }
  const cur = (state.shriekCountsByPlayer.get(playerId) ?? 0) + 1;
  state.shriekCountsByPlayer.set(playerId, cur);
  state.lastShriekTimes.set(playerId, nowSec);
  return {
    warningLevel: Math.min(SHRIEKS_FOR_WARDEN, cur),
    summonWarden: cur >= SHRIEKS_FOR_WARDEN,
  };
}
