// Redstone lamp. Lit when powered; emits light level 15. Unlike repeaters
// and torches, lamp has no tick delay — it responds to edges instantly
// and un-lights 2 ticks after the last power pulse (to prevent flicker).

export interface RedstoneLampState {
  lit: boolean;
  unlitCountdownTicks: number;
}

export function makeLamp(): RedstoneLampState {
  return { lit: false, unlitCountdownTicks: 0 };
}

export const LAMP_EMISSION_LIT = 15;
export const LAMP_EMISSION_UNLIT = 0;
const UNLIT_DELAY_TICKS = 2;

export interface LampTickCtx {
  powered: boolean;
}

export interface LampTickResult {
  lightChanged: boolean;
  emission: number;
}

export function tickLamp(state: RedstoneLampState, ctx: LampTickCtx): LampTickResult {
  const wasLit = state.lit;
  if (ctx.powered) {
    state.lit = true;
    state.unlitCountdownTicks = 0;
  } else if (state.lit) {
    if (state.unlitCountdownTicks === 0) {
      state.unlitCountdownTicks = UNLIT_DELAY_TICKS;
    } else {
      state.unlitCountdownTicks--;
      if (state.unlitCountdownTicks === 0) state.lit = false;
    }
  }
  return {
    lightChanged: state.lit !== wasLit,
    emission: state.lit ? LAMP_EMISSION_LIT : LAMP_EMISSION_UNLIT,
  };
}
