export type ItemCategory =
  | 'sword'
  | 'axe'
  | 'pickaxe'
  | 'shovel'
  | 'hoe'
  | 'bow'
  | 'crossbow'
  | 'trident'
  | 'mace'
  | 'fishing_rod'
  | 'helmet'
  | 'chestplate'
  | 'leggings'
  | 'boots'
  | 'elytra'
  | 'shield'
  | 'carrot_on_stick'
  | 'book';

const TABLE: Record<string, readonly ItemCategory[]> = {
  // Wiki (Java 1.21+): mace accepts the sharpness damage family +
  // fire_aspect + knockback. Was sword/axe-only — players couldn't
  // sharpness/smite/bane/fire_aspect/knockback their mace.
  sharpness: ['sword', 'axe', 'mace'],
  smite: ['sword', 'axe', 'mace'],
  bane_of_arthropods: ['sword', 'axe', 'mace'],
  fire_aspect: ['sword', 'mace'],
  knockback: ['sword', 'mace'],
  looting: ['sword'],
  sweeping_edge: ['sword'],
  efficiency: ['pickaxe', 'shovel', 'axe', 'hoe'],
  fortune: ['pickaxe', 'shovel', 'axe', 'hoe'],
  silk_touch: ['pickaxe', 'shovel', 'axe', 'hoe'],
  power: ['bow'],
  punch: ['bow'],
  flame: ['bow'],
  infinity: ['bow'],
  multishot: ['crossbow'],
  piercing: ['crossbow'],
  quick_charge: ['crossbow'],
  loyalty: ['trident'],
  riptide: ['trident'],
  impaling: ['trident'],
  channeling: ['trident'],
  density: ['mace'],
  breach: ['mace'],
  wind_burst: ['mace'],
  // Fishing rod enchantments — were missing entirely. Wiki: lure
  // reduces wait time, luck_of_the_sea improves catch quality.
  lure: ['fishing_rod'],
  luck_of_the_sea: ['fishing_rod'],
  respiration: ['helmet'],
  aqua_affinity: ['helmet'],
  thorns: ['helmet', 'chestplate', 'leggings', 'boots'],
  protection: ['helmet', 'chestplate', 'leggings', 'boots'],
  blast_protection: ['helmet', 'chestplate', 'leggings', 'boots'],
  fire_protection: ['helmet', 'chestplate', 'leggings', 'boots'],
  projectile_protection: ['helmet', 'chestplate', 'leggings', 'boots'],
  feather_falling: ['boots'],
  depth_strider: ['boots'],
  frost_walker: ['boots'],
  soul_speed: ['boots'],
  swift_sneak: ['leggings'],
  mending: [
    'sword',
    'axe',
    'pickaxe',
    'shovel',
    'hoe',
    'bow',
    'crossbow',
    'trident',
    'mace',
    'fishing_rod',
    'helmet',
    'chestplate',
    'leggings',
    'boots',
    'elytra',
    'shield',
  ],
  unbreaking: [
    'sword',
    'axe',
    'pickaxe',
    'shovel',
    'hoe',
    'bow',
    'crossbow',
    'trident',
    'mace',
    'fishing_rod',
    'helmet',
    'chestplate',
    'leggings',
    'boots',
    'elytra',
    'shield',
  ],
  curse_of_vanishing: [
    'sword',
    'axe',
    'pickaxe',
    'shovel',
    'hoe',
    'bow',
    'crossbow',
    'trident',
    'mace',
    'fishing_rod',
    'helmet',
    'chestplate',
    'leggings',
    'boots',
    'elytra',
    'shield',
  ],
  curse_of_binding: ['helmet', 'chestplate', 'leggings', 'boots', 'elytra'],
};

export function canApply(enchant: string, item: ItemCategory): boolean {
  const cats = TABLE[enchant];
  if (cats === undefined) return false;
  return cats.includes(item);
}
