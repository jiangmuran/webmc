// Breeze wind charge pushes entities outward with distance falloff.
// No damage; knockback only.
//
// Wiki (minecraft.wiki/w/Wind_Charge): "When a wind charge hits a
// block or entity it produces a small explosion-like push within a
// 1.5-block radius." Old WIND_CHARGE_RADIUS=3.5 was 2.3× the wiki
// value, pushing entities ~5–6 blocks beyond the canonical splash.
// Sibling breeze_wind_charge.ts already uses 1.5.
export const WIND_CHARGE_RADIUS = 1.5;

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
