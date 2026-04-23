export interface KnockbackInput {
  sourceX: number;
  sourceZ: number;
  targetX: number;
  targetZ: number;
  kbEnchantLevel: number;
  sprintingAttacker: boolean;
}

export function knockbackVelocity(i: KnockbackInput): { vx: number; vz: number; vy: number } {
  const dx = i.targetX - i.sourceX;
  const dz = i.targetZ - i.sourceZ;
  const len = Math.hypot(dx, dz) || 1;
  const strength = 0.4 + 0.5 * i.kbEnchantLevel + (i.sprintingAttacker ? 0.5 : 0);
  return {
    vx: (dx / len) * strength,
    vy: 0.4,
    vz: (dz / len) * strength,
  };
}
