export const SPIT_DAMAGE = 1;
export const SPIT_SPEED = 1.5;

export function damageOnHit(): number {
  return SPIT_DAMAGE;
}

export function hitVelocity(dx: number, dz: number): { vx: number; vz: number } {
  const d = Math.hypot(dx, dz);
  if (d === 0) return { vx: 0, vz: 0 };
  return { vx: (dx / d) * SPIT_SPEED, vz: (dz / d) * SPIT_SPEED };
}

export function targetsAttackersOnly(): boolean {
  return true;
}
