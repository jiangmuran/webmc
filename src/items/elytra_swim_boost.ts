export interface ElytraCtx {
  pitchRad: number;
  velocity: { vx: number; vy: number; vz: number };
  rocketBoost: number;
}

export function liftFromPitch(c: ElytraCtx): number {
  return Math.max(0, Math.sin(-c.pitchRad));
}

export function withBoost(v: number, boost: number): number {
  return v * (1 + boost * 0.1);
}

export function isGliding(c: ElytraCtx): boolean {
  return Math.hypot(c.velocity.vx, c.velocity.vy, c.velocity.vz) > 0.1;
}
