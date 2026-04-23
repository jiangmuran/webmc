// Bell ring physics. Swing arc + reverb time; direction based on hit side.

export const BELL_SWING_DURATION_TICKS = 60;
export const BELL_REVERB_MS = 1500;

export type BellHitSide = 'north' | 'south' | 'east' | 'west' | 'rope';

export interface BellState {
  swingTicksRemaining: number;
  lastHitSide: BellHitSide | null;
}

export function onHit(_s: BellState, side: BellHitSide): BellState {
  return { swingTicksRemaining: BELL_SWING_DURATION_TICKS, lastHitSide: side };
}

export function tick(s: BellState): BellState {
  if (s.swingTicksRemaining <= 0) return s;
  return { ...s, swingTicksRemaining: s.swingTicksRemaining - 1 };
}

export function swingAngle(s: BellState): number {
  if (s.swingTicksRemaining <= 0) return 0;
  const t = s.swingTicksRemaining / BELL_SWING_DURATION_TICKS;
  return Math.sin(t * Math.PI * 4) * 0.5 * t;
}

export function isActive(s: BellState): boolean {
  return s.swingTicksRemaining > 0;
}
