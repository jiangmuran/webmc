// Applies knockback velocity from attacker to target.

export interface Vec2 {
  x: number;
  z: number;
}

export function knockbackVelocity(attackerPos: Vec2, targetPos: Vec2, strength: number): Vec2 {
  const dx = targetPos.x - attackerPos.x;
  const dz = targetPos.z - attackerPos.z;
  const len = Math.hypot(dx, dz) || 1;
  const nx = dx / len;
  const nz = dz / len;
  return { x: nx * strength, z: nz * strength };
}

export const VERTICAL_BOOST = 0.4;

export function knockbackY(baseKnockback: number): number {
  return baseKnockback > 0 ? VERTICAL_BOOST : 0;
}

// Resistance attribute: 1.0 = full immunity.
export function applyResistance(kb: Vec2, resistance: number): Vec2 {
  const factor = 1 - Math.min(1, Math.max(0, resistance));
  return { x: kb.x * factor, z: kb.z * factor };
}
