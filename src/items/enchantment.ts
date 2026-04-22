import type { ItemDef, ItemStack } from './item';

export type EnchantmentId = string;

export interface EnchantmentDef {
  id: EnchantmentId;
  maxLevel: number;
  appliesTo: (def: ItemDef) => boolean;
  weight: number; // rarity hint (higher = more common)
}

const WEAPON_KINDS = new Set(['sword', 'axe']);
const PICK_KINDS = new Set(['pickaxe', 'axe', 'shovel']);

export const ENCHANTMENTS: Record<EnchantmentId, EnchantmentDef> = {
  sharpness: {
    id: 'sharpness',
    maxLevel: 5,
    appliesTo: (d) => WEAPON_KINDS.has(d.toolKind ?? ''),
    weight: 10,
  },
  efficiency: {
    id: 'efficiency',
    maxLevel: 5,
    appliesTo: (d) => PICK_KINDS.has(d.toolKind ?? ''),
    weight: 10,
  },
  unbreaking: {
    id: 'unbreaking',
    maxLevel: 3,
    appliesTo: (d) => d.durability > 0,
    weight: 5,
  },
  fortune: {
    id: 'fortune',
    maxLevel: 3,
    appliesTo: (d) => PICK_KINDS.has(d.toolKind ?? ''),
    weight: 2,
  },
  silk_touch: {
    id: 'silk_touch',
    maxLevel: 1,
    appliesTo: (d) => PICK_KINDS.has(d.toolKind ?? ''),
    weight: 1,
  },
  protection: {
    id: 'protection',
    maxLevel: 4,
    appliesTo: (d) =>
      d.name.includes('helmet') ||
      d.name.includes('chestplate') ||
      d.name.includes('leggings') ||
      d.name.includes('boots'),
    weight: 10,
  },
  power: {
    id: 'power',
    maxLevel: 5,
    appliesTo: (d) => d.name.includes('bow'),
    weight: 10,
  },
};

export interface Enchanted extends ItemStack {
  enchants?: ReadonlyMap<EnchantmentId, number>;
  name?: string;
}

export function applicableFor(def: ItemDef): EnchantmentDef[] {
  return Object.values(ENCHANTMENTS).filter((e) => e.appliesTo(def));
}

// Offer a weighted random enchantment at a chosen level (clamped to max).
export function rollEnchantment(
  def: ItemDef,
  desiredLevel: number,
  rng: () => number = Math.random,
): { id: EnchantmentId; level: number } | null {
  const candidates = applicableFor(def);
  if (candidates.length === 0) return null;
  const totalWeight = candidates.reduce((s, c) => s + c.weight, 0);
  let r = rng() * totalWeight;
  for (const c of candidates) {
    r -= c.weight;
    if (r <= 0) {
      return { id: c.id, level: Math.max(1, Math.min(desiredLevel, c.maxLevel)) };
    }
  }
  const last = candidates[candidates.length - 1];
  if (!last) return null;
  return { id: last.id, level: Math.max(1, Math.min(desiredLevel, last.maxLevel)) };
}

export function applyEnchant(stack: Enchanted, id: EnchantmentId, level: number): Enchanted {
  const next = new Map(stack.enchants);
  const cur = next.get(id) ?? 0;
  if (level > cur) next.set(id, level);
  return { ...stack, enchants: next };
}

export function hasEnchant(stack: Enchanted, id: EnchantmentId): number {
  return stack.enchants?.get(id) ?? 0;
}

// Damage multiplier contributed by weapon enchants (sharpness etc.).
export function weaponDamageBonus(stack: Enchanted): number {
  const sharpness = hasEnchant(stack, 'sharpness');
  return sharpness === 0 ? 0 : 1 + 0.5 * sharpness;
}
