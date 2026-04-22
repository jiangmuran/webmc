// TNT. Ignition starts a 4-second fuse after which it detonates with a
// power-4 explosion.

export interface TntState {
  fuseSec: number;
  ignited: boolean;
}

const FUSE_SEC = 4;

export function makeTnt(): TntState {
  return { fuseSec: 0, ignited: false };
}

export function igniteTnt(state: TntState): boolean {
  if (state.ignited) return false;
  state.ignited = true;
  state.fuseSec = FUSE_SEC;
  return true;
}

export interface TntTickResult {
  shouldExplode: boolean;
}

export function tickTnt(state: TntState, dtSec: number): TntTickResult {
  if (!state.ignited) return { shouldExplode: false };
  state.fuseSec = Math.max(0, state.fuseSec - dtSec);
  return { shouldExplode: state.fuseSec === 0 };
}

export const TNT_EXPLOSION_POWER = 4;
