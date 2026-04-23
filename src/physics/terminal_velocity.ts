// Terminal velocity + drag. Entities accumulate fall velocity until
// terminal. Elytra/feather-falling adjust effective drag.

export const GRAVITY = -0.08; // blocks / tick^2
export const DRAG_Y = 0.98; // per-tick multiplier
export const TERMINAL_FALL_VY = -3.92; // reached asymptotically

export function stepFall(vy: number): number {
  return Math.max(TERMINAL_FALL_VY, (vy + GRAVITY) * DRAG_Y);
}

export function elytraGlideVY(vy: number, pitchRad: number): number {
  // When gliding, drag is much lower and pitch bleeds altitude into speed.
  const newVy = vy + GRAVITY * Math.cos(pitchRad);
  return Math.max(-2, newVy * 0.99);
}

export function featherFallStep(vy: number, level: number): number {
  const adj = Math.min(0.25, level * 0.08);
  return Math.max(TERMINAL_FALL_VY * (1 - adj), (vy + GRAVITY) * DRAG_Y);
}
