// Hoglin → zoglin conversion. Hoglins in the overworld / end convert
// into zoglins after 300s (15s visible shake before). Also Hoglins
// actively flee any warped fungus placed block.

export type PorcineVariant = 'hoglin' | 'zoglin';

export interface PorcineState {
  variant: PorcineVariant;
  conversionTimerSec: number;
}

export function makePorcine(variant: PorcineVariant = 'hoglin'): PorcineState {
  return { variant, conversionTimerSec: 0 };
}

const CONVERT_TIME_SEC = 300;

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
    shaking: state.conversionTimerSec >= CONVERT_TIME_SEC - 15,
  };
}

export function fleesWarpedFungus(state: PorcineState): boolean {
  return state.variant === 'hoglin';
}
