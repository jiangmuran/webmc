// Firework damage. A firework rocket with star bursts deals damage to
// entities within a 5-block radius on explosion. Base damage scales with
// the number of stars in the rocket (each star adds 4 HP damage).

export interface FireworkStarDef {
  shape: 'small' | 'large' | 'star' | 'creeper' | 'burst';
  hasTrail: boolean;
  hasTwinkle: boolean;
}

export interface FireworkDamageQuery {
  stars: readonly FireworkStarDef[];
  playerDirectUse: boolean; // elytra boost — no damage to owner
}

// Wiki (minecraft.wiki/w/Firework_Rocket): a star-bearing rocket
// explosion deals 7 base damage with one star, plus 2 extra damage
// per additional star. Old formula was a flat 4 × stars, undershooting
// single-star (4 vs wiki 7) and overshooting many-star fireworks.
const BASE_DAMAGE_FIRST_STAR = 7;
const PER_EXTRA_STAR_DAMAGE = 2;
const EXPLOSION_RADIUS = 5;

export function fireworkBaseDamage(stars: readonly FireworkStarDef[]): number {
  if (stars.length === 0) return 0;
  return BASE_DAMAGE_FIRST_STAR + (stars.length - 1) * PER_EXTRA_STAR_DAMAGE;
}

export function fireworkDamageRadius(): number {
  return EXPLOSION_RADIUS;
}

// Compute per-target damage, given distance from explosion center.
export function damageAtDistance(q: FireworkDamageQuery, distance: number): number {
  if (distance > EXPLOSION_RADIUS) return 0;
  const base = fireworkBaseDamage(q.stars);
  if (base <= 0) return 0;
  const falloff = 1 - distance / EXPLOSION_RADIUS;
  return Math.max(0, Math.floor(base * falloff));
}

// Elytra boost: damage is applied to the boosting player ONLY if a
// star-bearing firework is used. Damage scales with the same wiki
// formula as direct hit: 7 base + 2 per extra star.
export function selfBoostDamage(stars: readonly FireworkStarDef[]): number {
  return fireworkBaseDamage(stars);
}
