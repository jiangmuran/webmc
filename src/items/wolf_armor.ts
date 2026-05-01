// Wolf armor (Armadillo scute, 1.20.5). Crafted from 6 armadillo scutes in
// a U-pattern. Applied to a tamed wolf; absorbs damage with durability and
// can be repaired by feeding more scutes to the wolf.

// Wiki (minecraft.wiki/w/Wolf_Armor): "Using an armadillo scute on
// a wolf wearing wolf armor heals 8 points of the armor's
// durability." Old REPAIR_PER_SCUTE = 16 was 2× the wiki value,
// halving the player's scute cost to keep wolf armor in repair.
const MAX_DURABILITY = 64;
const REPAIR_PER_SCUTE = 8;

export interface WolfArmor {
  durability: number;
  dyed?: [number, number, number]; // trimmed leather-style dye
}

export function makeWolfArmor(): WolfArmor {
  return { durability: MAX_DURABILITY };
}

export const WOLF_ARMOR_MAX_DURABILITY = MAX_DURABILITY;

export interface CraftWolfArmorQuery {
  armadilloScutes: number;
}

export function craftWolfArmor(q: CraftWolfArmorQuery): WolfArmor | null {
  if (q.armadilloScutes < 6) return null;
  return makeWolfArmor();
}

// Applies damage, clamped to [0, MAX_DURABILITY]. Returns the actual
// amount of durability consumed; if the armor breaks, the remainder is
// the overflow that hits the wolf.
export interface DamageResult {
  absorbed: number;
  broke: boolean;
  overflowDamage: number;
}

export function damageArmor(armor: WolfArmor, amount: number): DamageResult {
  const absorbed = Math.min(armor.durability, amount);
  armor.durability -= absorbed;
  const broke = armor.durability <= 0;
  return { absorbed, broke, overflowDamage: amount - absorbed };
}

// Repair with scutes. Each scute restores REPAIR_PER_SCUTE durability up
// to MAX_DURABILITY. Returns the number of scutes actually consumed.
export function repairArmor(armor: WolfArmor, scutes: number): number {
  if (armor.durability >= MAX_DURABILITY) return 0;
  let consumed = 0;
  while (consumed < scutes && armor.durability < MAX_DURABILITY) {
    armor.durability = Math.min(MAX_DURABILITY, armor.durability + REPAIR_PER_SCUTE);
    consumed++;
  }
  return consumed;
}
