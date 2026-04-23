// Snowball throwables. No damage to most mobs; deals 3 to blazes.
// Knockback on any mob.

export function damageOnHit(targetType: string): number {
  if (targetType === 'blaze') return 3;
  return 0;
}

export const KNOCKBACK_STRENGTH = 0.4;

export interface Vec2 {
  x: number;
  z: number;
}

export function knockbackDir(attackerPos: Vec2, targetPos: Vec2): Vec2 {
  const dx = targetPos.x - attackerPos.x;
  const dz = targetPos.z - attackerPos.z;
  const len = Math.hypot(dx, dz) || 1;
  return { x: (dx / len) * KNOCKBACK_STRENGTH, z: (dz / len) * KNOCKBACK_STRENGTH };
}

export function stacksUpTo(): number {
  return 16;
}
