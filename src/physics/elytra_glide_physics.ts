export interface GlideInput {
  vx: number;
  vy: number;
  vz: number;
  pitch: number;
}

export const GLIDE_GRAVITY = 0.08;
export const GLIDE_DRAG = 0.99;

export function glideTick(i: GlideInput): GlideInput {
  const cos = Math.cos(i.pitch);
  const sin = Math.sin(i.pitch);
  const horizontalSpeed = Math.hypot(i.vx, i.vz);
  let vy = i.vy - GLIDE_GRAVITY * (1 - cos * cos * 0.5);
  if (vy < 0 && horizontalSpeed > 0) {
    const lift = -vy * 0.1 * cos;
    vy += lift;
  }
  const horizBoost = Math.max(0, -sin) * 0.1;
  const scale = (horizontalSpeed + horizBoost) / Math.max(horizontalSpeed, 0.0001);
  return {
    vx: i.vx * scale * GLIDE_DRAG,
    vy: vy * GLIDE_DRAG,
    vz: i.vz * scale * GLIDE_DRAG,
    pitch: i.pitch,
  };
}

export function glideSpeed(i: GlideInput): number {
  return Math.hypot(i.vx, i.vy, i.vz);
}
