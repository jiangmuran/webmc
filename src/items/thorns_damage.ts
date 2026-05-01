// Thorns enchantment: when armor wearer is hit, attacker takes damage
// and the armor piece loses extra durability.

export const THORNS_MAX_LEVEL = 3;
// Wiki (minecraft.wiki/w/Thorns): "Level × 15% chance of the wearer
// inflicting 1 to 5 damage (not restricted to integer values) on
// anyone who attacks them." Old THORNS_MAX_DAMAGE = 4 was 1 short
// of wiki canon (5), and the integer roll `1 + floor(rand*4)`
// produced 1-4 instead of 1-5.
export const THORNS_MAX_DAMAGE = 5;
export const THORNS_DURABILITY_EXTRA = 2;

export function triggerChance(level: number): number {
  return level <= 0 ? 0 : 0.15 * level;
}

export function reflectedDamage(level: number, rand: () => number): number {
  if (rand() >= triggerChance(level)) return 0;
  // Wiki canon: 1-5 inclusive. Use 1 + floor(rand*5) for integer
  // half-heart units; wiki notes damage is "not restricted to integer
  // values" but most callers expect integer half-hearts.
  const dmg = 1 + Math.floor(rand() * 5);
  return Math.min(dmg, THORNS_MAX_DAMAGE);
}

export function stackChance(levelSum: number): number {
  // Total chance capped at 1.0 when summed across all armor slots.
  return Math.min(1, 0.15 * levelSum);
}
