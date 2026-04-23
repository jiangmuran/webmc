export interface Touch {
  x: number;
  y: number;
  active: boolean;
}

export interface DPadResult {
  forward: number;
  strafe: number;
}

export const DEAD_ZONE = 0.15;

export function stickVector(center: Touch, current: Touch, radiusPx: number): DPadResult {
  if (!current.active) return { forward: 0, strafe: 0 };
  const dx = (current.x - center.x) / radiusPx;
  const dy = (current.y - center.y) / radiusPx;
  const clampedDx = Math.max(-1, Math.min(1, dx));
  const clampedDy = Math.max(-1, Math.min(1, dy));
  const m = Math.hypot(clampedDx, clampedDy);
  if (m < DEAD_ZONE) return { forward: 0, strafe: 0 };
  return { forward: -clampedDy, strafe: clampedDx };
}
