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

const PER_STAR_DAMAGE = 4;
const EXPLOSION_RADIUS = 5;

export function fireworkBaseDamage(stars: readonly FireworkStarDef[]): number {
  return stars.length * PER_STAR_DAMAGE;
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

// Elytra boost: damage is applied to the boosting player ONLY if a firework
// with stars is used. Without stars, no self-damage.
export function selfBoostDamage(stars: readonly FireworkStarDef[]): number {
  if (stars.length === 0) return 0;
  return PER_STAR_DAMAGE + (stars.length - 1) * 2;
}
