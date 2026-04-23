// Armor damage formula (MC JE).
// final = incoming * (1 - min(20, max(armor/5, armor - incoming/(2+toughness/4))) / 25)

export function reducedDamage(incoming: number, armor: number, toughness: number): number {
  if (incoming <= 0 || armor <= 0) return Math.max(0, incoming);
  const a1 = armor / 5;
  const a2 = armor - incoming / (2 + toughness / 4);
  const effective = Math.min(20, Math.max(a1, a2));
  return incoming * (1 - effective / 25);
}

export function armorDurabilityCost(incoming: number): number {
  // 1 damage per 4 HP of incoming, min 1.
  return Math.max(1, Math.floor(incoming / 4));
}

export function toughnessOf(armorItem: string): number {
  if (armorItem.startsWith('netherite_')) return 3;
  if (armorItem.startsWith('diamond_')) return 2;
  return 0;
}
