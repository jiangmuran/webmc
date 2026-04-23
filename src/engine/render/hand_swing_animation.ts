export const SWING_DURATION_TICKS = 6;

export interface SwingState {
  ticksRemaining: number;
  amplitude: number;
}

export function startSwing(): SwingState {
  return { ticksRemaining: SWING_DURATION_TICKS, amplitude: 1 };
}

export function tickSwing(s: SwingState): SwingState {
  return {
    ticksRemaining: Math.max(0, s.ticksRemaining - 1),
    amplitude: s.amplitude,
  };
}

export function swingProgress(s: SwingState): number {
  if (s.ticksRemaining <= 0) return 0;
  return 1 - s.ticksRemaining / SWING_DURATION_TICKS;
}

export function swingAngle(s: SwingState): number {
  const t = swingProgress(s);
  return Math.sin(t * Math.PI) * s.amplitude * 45;
}
