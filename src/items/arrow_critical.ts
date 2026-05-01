// Arrow critical hit. An arrow is "critical" when fully drawn (charge
// ≥ 1) and not fired from a crossbow. Crit adds 0.25..1× bonus damage
// depending on a random roll.

export interface ArrowShotQuery {
  chargeFraction: number; // 0..1 (1 = full draw)
  fromCrossbow: boolean;
  powerEnchantLevel: number;
}

export interface ArrowShotResult {
  velocityMultiplier: number;
  critical: boolean;
  particleEmission: boolean;
}

const FULL_DRAW_THRESHOLD = 1.0;

export function computeArrowShot(q: ArrowShotQuery): ArrowShotResult {
  const fullDraw = q.chargeFraction >= FULL_DRAW_THRESHOLD;
  const vmul = Math.max(0.1, q.chargeFraction);
  // MC: crossbow arrows aren't "critical" per the bow-critical rule;
  // they have their own Quick-Charge/Piercing behavior.
  const critical = fullDraw && !q.fromCrossbow;
  return {
    velocityMultiplier: vmul,
    critical,
    particleEmission: critical,
  };
}

// Damage calculation for a hit. Velocity (in blocks/s equivalent) drives
// a ceil(speed × 2) base damage; critical adds a random 0..base/2 bonus.
export interface ArrowDamageQuery {
  arrowSpeed: number; // magnitude of velocity vector
  powerEnchantLevel: number;
  critical: boolean;
  rng: () => number;
}

// Wiki (minecraft.wiki/w/Power): "Power increases arrow damage by
// 25% × (level + 1), rounded up to nearest half-heart."
//
// Damage in MC is in half-heart units (1 HP = 1 half-heart), so
// "rounded up to nearest half-heart" = Math.ceil. Old Math.floor
// rounded DOWN, under-shooting whenever the bonus had a fractional
// half-heart (e.g. base=5, Power IV → bonus 6.25: floor=6, ceil=7).
// Sibling src/entities/arrow_trajectory.ts already uses Math.ceil
// after a previous fix; this module now matches wiki canon.
export function arrowDamage(q: ArrowDamageQuery): number {
  let base = Math.max(1, Math.ceil(q.arrowSpeed * 2));
  if (q.powerEnchantLevel > 0) {
    base += Math.ceil(base * (0.25 * q.powerEnchantLevel + 0.25));
  }
  if (q.critical) base += Math.floor(q.rng() * (base / 2 + 1));
  return base;
}

// Arrows fired at full draw get the full velocity; partial-draw arrows
// slow down after a few blocks and fall.
export function arrowAirDrag(velocity: number): number {
  return velocity * 0.99;
}
