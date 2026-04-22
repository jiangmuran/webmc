// Strider mount. Saddled striders carry a player over lava; warped
// fungus on a stick steers them. Striders shiver + take damage in rain.

export interface StriderState {
  saddled: boolean;
  riderId: number | null;
  shiveringInRain: boolean;
  inLava: boolean;
}

export function makeStrider(): StriderState {
  return { saddled: false, riderId: null, shiveringInRain: false, inLava: false };
}

export function saddleStrider(state: StriderState): boolean {
  if (state.saddled) return false;
  state.saddled = true;
  return true;
}

export function mountStrider(state: StriderState, playerId: number): boolean {
  if (!state.saddled || state.riderId !== null) return false;
  state.riderId = playerId;
  return true;
}

export function dismountStrider(state: StriderState): number | null {
  const r = state.riderId;
  state.riderId = null;
  return r;
}

export interface StriderTickCtx {
  inRain: boolean;
  inLava: boolean;
  dtSec: number;
}

export interface StriderTickResult {
  damageTaken: number;
}

export function tickStrider(state: StriderState, ctx: StriderTickCtx): StriderTickResult {
  state.shiveringInRain = ctx.inRain;
  state.inLava = ctx.inLava;
  return {
    damageTaken: ctx.inRain ? ctx.dtSec * 0.5 : 0,
  };
}

// Warped fungus on a stick gives temporary speed burst.
export interface BoostResult {
  boosted: boolean;
}

export function useWarpedFungus(state: StriderState): BoostResult {
  if (!state.saddled || state.riderId === null) return { boosted: false };
  return { boosted: true };
}
