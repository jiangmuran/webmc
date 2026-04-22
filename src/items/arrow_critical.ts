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

export function arrowDamage(q: ArrowDamageQuery): number {
  let base = Math.max(1, Math.ceil(q.arrowSpeed * 2));
  if (q.powerEnchantLevel > 0) {
    base += Math.floor(0.25 * (q.powerEnchantLevel + 1) + 0.5);
  }
  if (q.critical) base += Math.floor(q.rng() * (base / 2 + 1));
  return base;
}

// Arrows fired at full draw get the full velocity; partial-draw arrows
// slow down after a few blocks and fall.
export function arrowAirDrag(velocity: number): number {
  return velocity * 0.99;
}
