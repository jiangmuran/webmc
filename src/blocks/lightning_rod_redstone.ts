// Lightning rod comparator signal. Emits 15 for 8 ticks on strike.

export const PULSE_TICKS = 8;

export interface RodState {
  ticksRemaining: number;
}

export function onStrike(): RodState {
  return { ticksRemaining: PULSE_TICKS };
}

export function tick(s: RodState): RodState {
  return { ticksRemaining: Math.max(0, s.ticksRemaining - 1) };
}

export function redstoneOutput(s: RodState): number {
  return s.ticksRemaining > 0 ? 15 : 0;
}

export function isActive(s: RodState): boolean {
  return s.ticksRemaining > 0;
}
