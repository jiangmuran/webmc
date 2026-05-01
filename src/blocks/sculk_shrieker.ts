// Sculk shrieker. Shrieks when activated by sound / sensor; after 4
// shrieks of the same player within a time window, summons a warden.

export interface SculkShriekerState {
  shriekCountsByPlayer: Map<string, number>;
  lastShriekTimes: Map<string, number>;
  resetAfterSec: number;
}

const SHRIEKS_FOR_WARDEN = 4;
// Wiki (minecraft.wiki/w/Sculk_Shrieker): "If a player does not
// activate any sculk shrieker, the warning level decreases by 1
// every 10 minutes (12000 ticks)." Old 200 s (~3.3 min) was 3× too
// fast — players who narrowly escaped a warden could fully reset
// their warning in a single dive instead of having to wait the
// wiki-canonical ten minutes per level. Simplified model still
// uses a full-reset (vs graduated −1/level) but at least matches
// the per-level decay rate for parity.
const RESET_SEC = 600;

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
