export interface Item {
  enchantmentXp: number;
  maxDurability: number;
  durability: number;
}

export function xpReturnedOnDisenchant(item: Item): number {
  return Math.max(0, Math.floor(item.enchantmentXp * 0.5));
}

export function repairFromStacking(a: Item, b: Item): number {
  const damageA = a.maxDurability - a.durability;
  const damageB = b.maxDurability - b.durability;
  const repaired = Math.min(a.maxDurability, a.durability + b.durability + Math.floor(a.maxDurability * 0.05));
  void damageA;
  void damageB;
  return repaired;
}
