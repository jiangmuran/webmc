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

// Wiki (minecraft.wiki/w/Mace#Damage): "A successful smash attack
// causes a mace to deal 4 extra damage for each of the first 3
// blocks fallen, 2 extra damage for each of the next 5 blocks
// fallen, and 1 extra damage for each block fallen after that. The
// Density enchantment can be used to increase smash attack damage
// by 0.5 per level for each block fallen. The damage a mace smash
// attack can accumulate from falling is unlimited."
//
// Old formula capped fall at 8 blocks (so falling 100 blocks dealt
// the same bonus as falling 8) and applied Density only to the
// capped value. Wiki says smash damage is unlimited and Density
// applies to the full fall distance.
export function maceSmash(q: MaceSmashQuery): { damage: number; burst: Omit<WindBurst, 'center'> } {
  const f = Math.max(0, q.fallDistance);
  const tier1 = Math.min(f, 3); // first 3 blocks: +4 each
  const tier2 = Math.max(0, Math.min(f, 8) - 3); // next 5 blocks: +2 each
  const tier3 = Math.max(0, f - 8); // 9+: +1 each
  let bonus = tier1 * 4 + tier2 * 2 + tier3 * 1;
  bonus += q.densityLevel * 0.5 * f;
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
