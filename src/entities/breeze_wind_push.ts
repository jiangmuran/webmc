// Breeze wind charge pushes entities outward with distance falloff.
// No damage; knockback only.

export const WIND_CHARGE_RADIUS = 3.5;

export interface WindCtx {
  impactX: number;
  impactY: number;
  impactZ: number;
}

export function knockbackVelocity(
  ctx: WindCtx,
  target: { x: number; y: number; z: number },
): { vx: number; vy: number; vz: number } {
  const dx = target.x - ctx.impactX;
  const dy = target.y - ctx.impactY;
  const dz = target.z - ctx.impactZ;
  const dist = Math.hypot(dx, dy, dz);
  if (dist >= WIND_CHARGE_RADIUS || dist === 0) return { vx: 0, vy: 0, vz: 0 };
  const power = (1 - dist / WIND_CHARGE_RADIUS) * 1.5;
  return { vx: (dx / dist) * power, vy: (dy / dist) * power, vz: (dz / dist) * power };
}

export function damageDealt(): number {
  return 0;
}
