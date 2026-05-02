export interface ExplosionInput {
  radius: number;
  distance: number;
  blastProtection: number;
  shielded: boolean;
}

// Wiki (minecraft.wiki/w/Explosion#Damage):
//   impact = (1 − distance/(2·power)) · exposure
//   damage = ((impact² + impact)/2) · 7·(2·power) + 1
//          = 7·power·(impact² + impact) + 1
//
// The `radius` parameter here is the explosion cutoff distance,
// which in MC = 2·power. So power = radius/2, and:
//   damage = 7·(radius/2)·(f² + f) + 1
//          = 3.5·radius·(f² + f) + 1
// where f = 1 − distance/radius (≡ impact at exposure=1).
//
// Old `(f² × 7 + f) × radius` had the right f² scaling but only
// `1×radius·f` for the f term (wiki has `3.5×radius·f`) and dropped
// the +1 constant. Net effect: under-damaged at mid-range and lost
// the wiki guarantee that any in-range entity takes ≥ 1 damage
// even when fully shielded by exposure (the +1 constant).
export function rawDamage(i: ExplosionInput): number {
  if (i.distance >= i.radius) return 0;
  const f = 1 - i.distance / i.radius;
  return Math.floor(3.5 * i.radius * (f * f + f) + 1);
}

export function reducedByProtection(damage: number, blastProt: number): number {
  const reduction = Math.min(0.8, blastProt * 0.08);
  return damage * (1 - reduction);
}

export function appliedDamage(i: ExplosionInput): number {
  let d = rawDamage(i);
  d = reducedByProtection(d, i.blastProtection);
  if (i.shielded) d *= 0.5;
  return Math.max(0, Math.floor(d));
}

export function blockBreakProbability(blockResistance: number, explosionPower: number): number {
  if (explosionPower <= 0) return 0;
  const ratio = (explosionPower - blockResistance) / explosionPower;
  return Math.max(0, Math.min(1, ratio));
}
