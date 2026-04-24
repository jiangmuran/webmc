export interface DamageableItem {
  id: string;
  maxDurability: number;
  damage: number;
  unbreakingLevel: number;
}

export function isBroken(item: DamageableItem): boolean {
  return item.damage >= item.maxDurability;
}

export function damageChancePassUnbreaking(level: number, rng: () => number): boolean {
  if (level <= 0) return true;
  const chance = 1 / (level + 1);
  return rng() < chance;
}

export function applyDamage(
  item: DamageableItem,
  amount = 1,
  rng: () => number = Math.random,
): DamageableItem {
  let addedDamage = 0;
  for (let i = 0; i < amount; i++) {
    if (damageChancePassUnbreaking(item.unbreakingLevel, rng)) addedDamage++;
  }
  return { ...item, damage: Math.min(item.maxDurability, item.damage + addedDamage) };
}

export function durabilityPercent(item: DamageableItem): number {
  return 1 - item.damage / item.maxDurability;
}
