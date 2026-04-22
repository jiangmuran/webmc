// Wandering trader despawn lifecycle. Spawns with a 40-minute timer that
// does not pause; despawn is forced at zero, whether or not a player is
// nearby. Trader despawn also cleans up its 2 leashed llamas.

const LIFESPAN_SEC = 40 * 60;

export interface TraderDespawnState {
  remainingSec: number;
  despawned: boolean;
}

export function makeTraderDespawn(): TraderDespawnState {
  return { remainingSec: LIFESPAN_SEC, despawned: false };
}

export const TRADER_LIFESPAN_SEC = LIFESPAN_SEC;

export interface TraderDespawnResult {
  despawnNow: boolean;
  llamasToFree: boolean;
}

export function tickTraderDespawn(state: TraderDespawnState, dtSec: number): TraderDespawnResult {
  if (state.despawned) return { despawnNow: false, llamasToFree: false };
  state.remainingSec = Math.max(0, state.remainingSec - dtSec);
  if (state.remainingSec <= 0) {
    state.despawned = true;
    return { despawnNow: true, llamasToFree: true };
  }
  return { despawnNow: false, llamasToFree: false };
}

// Force an early despawn (e.g., player killed trader, chunk unloaded with
// no player tickets). Returns true if this call caused the despawn.
export function forceDespawn(state: TraderDespawnState): boolean {
  if (state.despawned) return false;
  state.despawned = true;
  state.remainingSec = 0;
  return true;
}
