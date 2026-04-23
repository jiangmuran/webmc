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
  sharpness: ['sword', 'axe'],
  smite: ['sword', 'axe'],
  bane_of_arthropods: ['sword', 'axe'],
  fire_aspect: ['sword'],
  knockback: ['sword'],
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
