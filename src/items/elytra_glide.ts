// Elytra glide physics. Activated by jumping in mid-air with an
// elytra equipped. Horizontal speed increases with dive angle; upward
// pitch bleeds horizontal speed. Firework rockets boost.

export interface GlideState {
  velX: number;
  velY: number;
  velZ: number;
  pitch: number; // radians, negative = looking up
  yaw: number;
  gliding: boolean;
}

export const GRAVITY = 0.08;
export const GLIDE_DRAG = 0.99;
export const PITCH_LIFT = 0.75;

export function makeGlide(): GlideState {
  return { velX: 0, velY: 0, velZ: 0, pitch: 0, yaw: 0, gliding: false };
}

// One tick of glide update (no ground collision).
export function tickGlide(s: GlideState): void {
  if (!s.gliding) {
    s.velY -= GRAVITY;
    return;
  }
  const lookX = -Math.sin(s.yaw) * Math.cos(s.pitch);
  const lookY = -Math.sin(s.pitch);
  const lookZ = Math.cos(s.yaw) * Math.cos(s.pitch);

  // gravity
  s.velY -= GRAVITY * (1 - Math.abs(lookY) * PITCH_LIFT);

  // dive → accelerate in look dir
  if (s.pitch > 0) {
    const gain = s.pitch * 0.1;
    s.velX += lookX * gain;
    s.velY += lookY * gain;
    s.velZ += lookZ * gain;
  }

  // drag
  s.velX *= GLIDE_DRAG;
  s.velY *= GLIDE_DRAG;
  s.velZ *= GLIDE_DRAG;
}

// Firework boost adds to velocity along look direction.
export function applyFireworkBoost(s: GlideState, magnitude: number): void {
  if (!s.gliding) return;
  const lookX = -Math.sin(s.yaw) * Math.cos(s.pitch);
  const lookY = -Math.sin(s.pitch);
  const lookZ = Math.cos(s.yaw) * Math.cos(s.pitch);
  s.velX += lookX * magnitude;
  s.velY += lookY * magnitude;
  s.velZ += lookZ * magnitude;
}

export function speed(s: GlideState): number {
  return Math.sqrt(s.velX * s.velX + s.velY * s.velY + s.velZ * s.velZ);
}
