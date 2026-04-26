// Held-item idle sway. Gently moves held item based on mouse delta
// (creates weight-on-hand feeling).

export interface SwayState {
  x: number;
  y: number;
}

export const SWAY_SMOOTHING = 0.2;
export const SWAY_MAX = 0.5;

// In-place mutation — was returning fresh {x, y} per call. settle is
// per-frame; original allocation showed up in heap snapshots.
export function onMouseDelta(s: SwayState, dx: number, dy: number): SwayState {
  s.x = clamp(s.x - dx * 0.002);
  s.y = clamp(s.y + dy * 0.002);
  return s;
}

export function settle(s: SwayState): SwayState {
  s.x *= 1 - SWAY_SMOOTHING;
  s.y *= 1 - SWAY_SMOOTHING;
  return s;
}

function clamp(v: number): number {
  return Math.max(-SWAY_MAX, Math.min(SWAY_MAX, v));
}

export function reset(): SwayState {
  return { x: 0, y: 0 };
}
