// Strider mount. Saddled striders carry a player over lava; warped
// fungus on a stick steers them. Striders shiver + take damage in rain.
//
// Wiki (minecraft.wiki/w/Strider): "Striders are damaged by water,
// rain, and splash water bottles, which deal damage by 1 hp per
// splash water bottle or half-second in water or rain."
// 1 hp / 0.5 s = 2 hp / s. Old code dealt 0.5 hp/s, 4× slower than
// wiki — striders kept alive 4× longer in rain than canon.

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
  // Wiki: 1 HP / 0.5 s = 2 HP/s in rain (lava does not protect).
  return {
    damageTaken: ctx.inRain ? ctx.dtSec * 2 : 0,
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
