// Held-item idle sway. Gently moves held item based on mouse delta
// (creates weight-on-hand feeling).

export interface SwayState {
  x: number;
  y: number;
}

export const SWAY_SMOOTHING = 0.2;
export const SWAY_MAX = 0.5;

export function onMouseDelta(s: SwayState, dx: number, dy: number): SwayState {
  const nx = s.x - dx * 0.002;
  const ny = s.y + dy * 0.002;
  return { x: clamp(nx), y: clamp(ny) };
}

export function settle(s: SwayState): SwayState {
  return { x: s.x * (1 - SWAY_SMOOTHING), y: s.y * (1 - SWAY_SMOOTHING) };
}

function clamp(v: number): number {
  return Math.max(-SWAY_MAX, Math.min(SWAY_MAX, v));
}

export function reset(): SwayState {
  return { x: 0, y: 0 };
}
