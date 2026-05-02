// Hoglin → zoglin conversion. Hoglins in the overworld / end convert
// into zoglins per wiki. Hoglins also flee placed warped fungus.
//
// Wiki (minecraft.wiki/w/Hoglin#Zombification): "If a hoglin
// spawns in or moves to the Overworld or the End, it shakes and
// then transforms into a zoglin after 15 seconds." Entity data:
// "TimeInOverworld: ... the hoglin converts to a zoglin when this
// is greater than 300 [ticks]." 300 ticks = 15 seconds.
//
// Old constant was 300 seconds (5 minutes) — 20× the wiki value,
// confusing ticks with seconds. Hoglins escaped to overworld
// stayed hoglins for 5 minutes instead of 15 s.

export type PorcineVariant = 'hoglin' | 'zoglin';

export interface PorcineState {
  variant: PorcineVariant;
  conversionTimerSec: number;
}

export function makePorcine(variant: PorcineVariant = 'hoglin'): PorcineState {
  return { variant, conversionTimerSec: 0 };
}

const CONVERT_TIME_SEC = 15;
// Visible shake leads the conversion by ~5 s in vanilla.
const SHAKE_LEAD_SEC = 5;

export interface ConversionCtx {
  inNether: boolean;
  dtSec: number;
}

export interface ConversionResult {
  converted: boolean;
  shaking: boolean;
}

export function tickPorcineConversion(state: PorcineState, ctx: ConversionCtx): ConversionResult {
  if (state.variant === 'zoglin') return { converted: false, shaking: false };
  if (ctx.inNether) {
    state.conversionTimerSec = 0;
    return { converted: false, shaking: false };
  }
  state.conversionTimerSec += ctx.dtSec;
  if (state.conversionTimerSec >= CONVERT_TIME_SEC) {
    state.variant = 'zoglin';
    state.conversionTimerSec = 0;
    return { converted: true, shaking: false };
  }
  return {
    converted: false,
    shaking: state.conversionTimerSec >= CONVERT_TIME_SEC - SHAKE_LEAD_SEC,
  };
}

export function fleesWarpedFungus(state: PorcineState): boolean {
  return state.variant === 'hoglin';
}
