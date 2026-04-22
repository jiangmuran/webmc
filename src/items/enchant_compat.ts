// Enchantment compatibility + extra enchants not in the base registry.
// Maintains conflict groups (MC: fortune/silk_touch conflict; protection
// group; sword-infusions group; bow-only group; etc.)

import type { EnchantmentId } from './enchantment';

// Pairs of enchants that conflict: applying one prevents the other.
export const CONFLICT_GROUPS: readonly (readonly string[])[] = [
  ['fortune', 'silk_touch'],
  ['protection', 'blast_protection', 'fire_protection', 'projectile_protection'],
  ['sharpness', 'smite', 'bane_of_arthropods', 'breach', 'density'],
  ['infinity', 'mending'],
  ['piercing', 'multishot'],
  ['loyalty', 'riptide'],
  ['riptide', 'channeling'],
  ['depth_strider', 'frost_walker'],
];

export function conflicts(a: EnchantmentId, b: EnchantmentId): boolean {
  if (a === b) return false;
  for (const group of CONFLICT_GROUPS) {
    if (group.includes(a) && group.includes(b)) return true;
  }
  return false;
}

// Additional enchantments — registered out-of-band because the base
// enchantment.ts ships a minimal 7-entry registry.
export interface ExtraEnchant {
  id: string;
  maxLevel: number;
  description: string;
}

export const EXTRA_ENCHANTS: readonly ExtraEnchant[] = [
  { id: 'mending', maxLevel: 1, description: 'XP repairs durability' },
  { id: 'infinity', maxLevel: 1, description: 'Bow does not consume arrows' },
  { id: 'respiration', maxLevel: 3, description: 'Extends breath underwater' },
  { id: 'aqua_affinity', maxLevel: 1, description: 'Mine at land speed underwater' },
  { id: 'depth_strider', maxLevel: 3, description: 'Faster underwater movement' },
  { id: 'frost_walker', maxLevel: 2, description: 'Freezes water under feet' },
  { id: 'soul_speed', maxLevel: 3, description: 'Faster on soul sand / soul soil' },
  { id: 'swift_sneak', maxLevel: 3, description: 'Faster while sneaking' },
  { id: 'riptide', maxLevel: 3, description: 'Launches with trident in water/rain' },
  { id: 'loyalty', maxLevel: 3, description: 'Thrown trident returns' },
  { id: 'channeling', maxLevel: 1, description: 'Trident calls lightning in thunder' },
  { id: 'impaling', maxLevel: 5, description: 'Trident +damage to aquatic mobs' },
  { id: 'sweeping_edge', maxLevel: 3, description: 'Sword sweep deals more damage' },
  { id: 'knockback', maxLevel: 2, description: 'Sword sends target flying' },
  { id: 'fire_aspect', maxLevel: 2, description: 'Sword ignites target' },
  { id: 'looting', maxLevel: 3, description: 'Mob drop bonus' },
  { id: 'smite', maxLevel: 5, description: 'Sword +damage to undead' },
  { id: 'bane_of_arthropods', maxLevel: 5, description: 'Sword +damage to spiders' },
  { id: 'flame', maxLevel: 1, description: 'Bow shoots flaming arrows' },
  { id: 'punch', maxLevel: 2, description: 'Bow adds extra knockback' },
  { id: 'fire_protection', maxLevel: 4, description: 'Armor reduces fire damage' },
  { id: 'blast_protection', maxLevel: 4, description: 'Armor reduces explosion damage' },
  { id: 'projectile_protection', maxLevel: 4, description: 'Armor reduces projectile damage' },
  { id: 'feather_falling', maxLevel: 4, description: 'Armor reduces fall damage' },
  { id: 'thorns', maxLevel: 3, description: 'Armor damages attackers' },
  { id: 'breach', maxLevel: 4, description: 'Mace armor penetration' },
  { id: 'density', maxLevel: 5, description: 'Mace smash +damage per fall block' },
  { id: 'wind_burst', maxLevel: 3, description: 'Mace smash launches user upward' },
  { id: 'curse_of_binding', maxLevel: 1, description: 'Cannot remove armor from player' },
  { id: 'curse_of_vanishing', maxLevel: 1, description: 'Item disappears on death' },
];

export function getExtraEnchant(id: string): ExtraEnchant | null {
  for (const e of EXTRA_ENCHANTS) if (e.id === id) return e;
  return null;
}
