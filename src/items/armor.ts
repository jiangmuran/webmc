// Armor defense model. Given a set of 4 armor slots and the enchants on
// each piece, compute the damage the player actually takes from an incoming
// hit. Matches MC's "armor points + toughness + protection enchant" formula:
//
//   mitigatedPercent = clamp(armor - damage/2/(toughness/4+2), armor*0.2) / 25
//   finalDamage = damage * (1 - mitigatedPercent) * (1 - protectionMitigation)

import { hasEnchant, type Enchanted } from './enchantment';

export type ArmorSlot = 'helmet' | 'chestplate' | 'leggings' | 'boots';

export interface ArmorDef {
  name: string;
  slot: ArmorSlot;
  defense: number; // armor points (1 pt = half shield)
  toughness: number;
  durability: number;
}

export const ARMOR_DEFS: Record<string, ArmorDef> = {
  leather_helmet: {
    name: 'webmc:leather_helmet',
    slot: 'helmet',
    defense: 1,
    toughness: 0,
    durability: 55,
  },
  leather_chestplate: {
    name: 'webmc:leather_chestplate',
    slot: 'chestplate',
    defense: 3,
    toughness: 0,
    durability: 80,
  },
  leather_leggings: {
    name: 'webmc:leather_leggings',
    slot: 'leggings',
    defense: 2,
    toughness: 0,
    durability: 75,
  },
  leather_boots: {
    name: 'webmc:leather_boots',
    slot: 'boots',
    defense: 1,
    toughness: 0,
    durability: 65,
  },
  iron_helmet: {
    name: 'webmc:iron_helmet',
    slot: 'helmet',
    defense: 2,
    toughness: 0,
    durability: 165,
  },
  iron_chestplate: {
    name: 'webmc:iron_chestplate',
    slot: 'chestplate',
    defense: 6,
    toughness: 0,
    durability: 240,
  },
  iron_leggings: {
    name: 'webmc:iron_leggings',
    slot: 'leggings',
    defense: 5,
    toughness: 0,
    durability: 225,
  },
  iron_boots: {
    name: 'webmc:iron_boots',
    slot: 'boots',
    defense: 2,
    toughness: 0,
    durability: 195,
  },
  diamond_helmet: {
    name: 'webmc:diamond_helmet',
    slot: 'helmet',
    defense: 3,
    toughness: 2,
    durability: 363,
  },
  diamond_chestplate: {
    name: 'webmc:diamond_chestplate',
    slot: 'chestplate',
    defense: 8,
    toughness: 2,
    durability: 528,
  },
  diamond_leggings: {
    name: 'webmc:diamond_leggings',
    slot: 'leggings',
    defense: 6,
    toughness: 2,
    durability: 495,
  },
  diamond_boots: {
    name: 'webmc:diamond_boots',
    slot: 'boots',
    defense: 3,
    toughness: 2,
    durability: 429,
  },
  netherite_chestplate: {
    name: 'webmc:netherite_chestplate',
    slot: 'chestplate',
    defense: 8,
    toughness: 3,
    durability: 592,
  },
  turtle_shell: {
    name: 'webmc:turtle_shell',
    slot: 'helmet',
    defense: 2,
    toughness: 0,
    durability: 275,
  },
};

export interface ArmorPiece {
  def: ArmorDef;
  stack: Enchanted;
}

export interface ArmorSet {
  helmet: ArmorPiece | null;
  chestplate: ArmorPiece | null;
  leggings: ArmorPiece | null;
  boots: ArmorPiece | null;
}

export function makeEmptyArmorSet(): ArmorSet {
  return { helmet: null, chestplate: null, leggings: null, boots: null };
}

export function totalDefense(set: ArmorSet): number {
  let d = 0;
  for (const k of ['helmet', 'chestplate', 'leggings', 'boots'] as const) {
    const p = set[k];
    if (p) d += p.def.defense;
  }
  return d;
}

export function totalToughness(set: ArmorSet): number {
  let t = 0;
  for (const k of ['helmet', 'chestplate', 'leggings', 'boots'] as const) {
    const p = set[k];
    if (p) t += p.def.toughness;
  }
  return t;
}

export function protectionLevel(set: ArmorSet): number {
  let p = 0;
  for (const k of ['helmet', 'chestplate', 'leggings', 'boots'] as const) {
    const piece = set[k];
    if (piece) p += hasEnchant(piece.stack, 'protection');
  }
  return p;
}

export function incomingDamage(rawDamage: number, set: ArmorSet): number {
  const armor = totalDefense(set);
  const toughness = totalToughness(set);
  const protection = protectionLevel(set);
  if (armor === 0 && protection === 0) return rawDamage;
  const armorMitigation = Math.min(armor - rawDamage / (2 + toughness / 4), armor * 0.2) / 25;
  const armorFactor = Math.max(0, Math.min(0.8, armorMitigation));
  const afterArmor = rawDamage * (1 - armorFactor);
  const protFactor = Math.min(0.8, protection * 0.04); // clamp at 80%
  return afterArmor * (1 - protFactor);
}
