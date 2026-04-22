// Combat knockback. A melee hit applies a horizontal push along the
// attacker→target vector + a small vertical bump. Sprint-attack doubles
// the horizontal push. Knockback enchant adds per-level strength.
// Knockback resistance (armor attribute) linearly reduces final impulse.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface KnockbackQuery {
  attackerPos: Vec3;
  targetPos: Vec3;
  sprinting: boolean;
  knockbackLevel: number; // 0..5 from enchant
  knockbackResistance: number; // 0..1 from armor attribute
}

const BASE_HORIZONTAL = 0.4;
const BASE_VERTICAL = 0.36;
const SPRINT_BONUS = 0.5;
const PER_LEVEL_BONUS = 0.5;

export function computeKnockback(q: KnockbackQuery): Vec3 {
  const dx = q.targetPos.x - q.attackerPos.x;
  const dz = q.targetPos.z - q.attackerPos.z;
  const hLen = Math.hypot(dx, dz);
  let horizontal = BASE_HORIZONTAL;
  if (q.sprinting) horizontal += SPRINT_BONUS;
  if (q.knockbackLevel > 0) horizontal += q.knockbackLevel * PER_LEVEL_BONUS;
  const resist = Math.max(0, Math.min(1, q.knockbackResistance));
  horizontal *= 1 - resist;
  if (hLen === 0) {
    return { x: 0, y: BASE_VERTICAL * (1 - resist), z: 0 };
  }
  const ux = dx / hLen;
  const uz = dz / hLen;
  return {
    x: ux * horizontal,
    y: BASE_VERTICAL * (1 - resist),
    z: uz * horizontal,
  };
}

// Arrow knockback: per-level +0.6 horizontal based on arrow velocity.
export interface ArrowKnockbackQuery {
  arrowVelocity: Vec3;
  punchLevel: number;
  knockbackResistance: number;
}

export function computeArrowKnockback(q: ArrowKnockbackQuery): Vec3 {
  const vLen = Math.hypot(q.arrowVelocity.x, q.arrowVelocity.z) || 1;
  const base = 0.3;
  const punchBonus = q.punchLevel > 0 ? q.punchLevel * 0.6 : 0;
  const h = (base + punchBonus) * (1 - Math.max(0, Math.min(1, q.knockbackResistance)));
  return {
    x: (q.arrowVelocity.x / vLen) * h,
    y: 0.1,
    z: (q.arrowVelocity.z / vLen) * h,
  };
}
