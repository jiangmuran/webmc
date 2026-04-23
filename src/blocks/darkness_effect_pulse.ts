export interface DarknessState {
  remainingTicks: number;
  amplifier: number;
}

export const MAX_PULSE_STRENGTH = 1;
export const PULSE_PERIOD_TICKS = 20;
export const FADE_TAIL_TICKS = 40;

export function pulseFactor(state: DarknessState, tick: number): number {
  if (state.remainingTicks <= 0) return 0;
  const inTail = state.remainingTicks < FADE_TAIL_TICKS;
  const base = inTail ? state.remainingTicks / FADE_TAIL_TICKS : 1;
  const sway = (Math.sin((tick * Math.PI * 2) / PULSE_PERIOD_TICKS) + 1) / 2;
  return MAX_PULSE_STRENGTH * base * sway;
}

export function viewDistanceMultiplier(state: DarknessState, tick: number): number {
  const p = pulseFactor(state, tick);
  return 1 - 0.7 * p;
}
