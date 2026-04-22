// Armor + toughness damage reduction. MC formula:
//   defense = min(20, max(armor/5, armor - damage/(2+toughness/4)))
//   reduction = defense * 4 % → clamp to 80%
// So toughness protects against high-damage hits more than low-damage ones.

export interface ArmorQuery {
  armor: number; // 0..20 armor points
  toughness: number; // 0..20 toughness points (diamond/netherite)
  incomingDamage: number;
}

// Returns the damage after armor reduction.
export function applyArmorReduction(q: ArmorQuery): number {
  const armor = Math.max(0, q.armor);
  const toughness = Math.max(0, q.toughness);
  const dmg = Math.max(0, q.incomingDamage);

  const protectionPoints = Math.min(20, Math.max(armor / 5, armor - dmg / (2 + toughness / 4)));
  const reduction = Math.min(0.8, protectionPoints / 25);
  return dmg * (1 - reduction);
}

// Per-slot armor point totals for comparison reporting.
export interface ArmorPieces {
  helmet: number;
  chest: number;
  leggings: number;
  boots: number;
}

export function armorTotal(p: ArmorPieces): number {
  return p.helmet + p.chest + p.leggings + p.boots;
}

// A big-damage hit (e.g. an anvil fall) exceeds a full diamond set's
// 20-armor cap; use this helper to compute how many HP a hit will actually
// remove after armor.
export function damageAfterArmor(q: ArmorQuery): number {
  return Math.floor(applyArmorReduction(q) * 1000) / 1000;
}
