// Wind charge (1.21): a throwable projectile that creates a non-damaging
// "wind burst" on impact, knocking back entities. Mace smash attack also
// produces a wind burst with greater radius + damage.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface WindBurst {
  center: Vec3;
  radius: number;
  knockbackStrength: number;
  damage: number;
}

export const WIND_CHARGE_BURST: Omit<WindBurst, 'center'> = {
  radius: 2,
  knockbackStrength: 1.2,
  damage: 0,
};

export function makeWindChargeBurst(center: Vec3): WindBurst {
  return { center, ...WIND_CHARGE_BURST };
}

// Mace smash: power scales with fall distance (MC 1.21 "density" enchant
// optional modifier). Returns the wind burst + attack damage.
export interface MaceSmashQuery {
  fallDistance: number; // in blocks
  densityLevel: number; // 0..5 enchantment level
  base: number; // weapon base damage
}

export function maceSmash(q: MaceSmashQuery): { damage: number; burst: Omit<WindBurst, 'center'> } {
  // MC formula: damage = base + 4 * fall for first 3 blocks, then 2 * fall.
  let bonus = 0;
  const capped = Math.min(q.fallDistance, 8);
  if (capped <= 3) {
    bonus = 4 * capped;
  } else {
    bonus = 12 + 2 * (capped - 3);
  }
  bonus += q.densityLevel * 0.5 * capped;
  return {
    damage: q.base + bonus,
    burst: {
      radius: 3.5,
      knockbackStrength: 1.5,
      damage: 0,
    },
  };
}

// Knockback calculation: distance from burst center → knockback vector.
export function knockbackVector(burst: WindBurst, entityPos: Vec3): Vec3 | null {
  const dx = entityPos.x - burst.center.x;
  const dy = entityPos.y - burst.center.y;
  const dz = entityPos.z - burst.center.z;
  const dist = Math.hypot(dx, dy, dz);
  if (dist > burst.radius) return null;
  const falloff = 1 - dist / burst.radius;
  const mag = burst.knockbackStrength * falloff;
  const inv = dist > 0 ? 1 / dist : 0;
  return {
    x: dx * inv * mag,
    y: dy * inv * mag + 0.3, // always a bit of upward lift
    z: dz * inv * mag,
  };
}
