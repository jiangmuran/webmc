export interface WindCharge {
  impactX: number;
  impactY: number;
  impactZ: number;
  knockbackStrength: number;
}

export const KNOCKBACK_RADIUS = 4;

export function knockbackForEntity(
  w: WindCharge,
  entityX: number,
  entityY: number,
  entityZ: number,
): { vx: number; vy: number; vz: number } {
  const dx = entityX - w.impactX;
  const dy = entityY - w.impactY;
  const dz = entityZ - w.impactZ;
  const dist = Math.hypot(dx, dy, dz);
  if (dist === 0 || dist > KNOCKBACK_RADIUS) return { vx: 0, vy: 0, vz: 0 };
  const falloff = 1 - dist / KNOCKBACK_RADIUS;
  const scale = (w.knockbackStrength * falloff) / dist;
  return { vx: dx * scale, vy: dy * scale, vz: dz * scale };
}

export function breaksSomeBlocks(): string[] {
  return ['bamboo', 'candle', 'dripleaf', 'cobweb', 'chorus_flower'];
}
