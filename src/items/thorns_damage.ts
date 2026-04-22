// Thorns enchantment: when armor wearer is hit, attacker takes damage
// and the armor piece loses extra durability.

export const THORNS_MAX_LEVEL = 3;
export const THORNS_MAX_DAMAGE = 4;
export const THORNS_DURABILITY_EXTRA = 2;

export function triggerChance(level: number): number {
  return level <= 0 ? 0 : 0.15 * level;
}

export function reflectedDamage(level: number, rand: () => number): number {
  if (rand() >= triggerChance(level)) return 0;
  // 1 + floor(rand*3), capped at THORNS_MAX_DAMAGE.
  const dmg = 1 + Math.floor(rand() * 3);
  return Math.min(dmg, THORNS_MAX_DAMAGE);
}

export function stackChance(levelSum: number): number {
  // Total chance capped at 1.0 when summed across all armor slots.
  return Math.min(1, 0.15 * levelSum);
}
