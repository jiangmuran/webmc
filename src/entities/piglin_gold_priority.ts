// Wiki (minecraft.wiki/w/Piglin#Piglin_loved_items): the complete
// `piglin_loved` tag. Old set was missing golden_dandelion,
// golden_nautilus_armor, and golden_spear (1.21+ additions), and
// incorrectly included `powered_rail` — that block uses gold in
// crafting but is NOT in the piglin_loved tag. Wiki only lists
// Light Weighted Pressure Plate among gold-alloy redstone components.
const GOLD_ITEMS = new Set<string>([
  'gold_ingot',
  'gold_block',
  'gold_nugget',
  'raw_gold',
  'raw_gold_block',
  'gilded_blackstone',
  'nether_gold_ore',
  'gold_ore',
  'deepslate_gold_ore',
  'golden_apple',
  'enchanted_golden_apple',
  'golden_carrot',
  'golden_dandelion',
  'glistering_melon_slice',
  'golden_sword',
  'golden_pickaxe',
  'golden_axe',
  'golden_shovel',
  'golden_hoe',
  'golden_spear',
  'golden_helmet',
  'golden_chestplate',
  'golden_leggings',
  'golden_boots',
  'golden_horse_armor',
  'golden_nautilus_armor',
  'clock',
  'light_weighted_pressure_plate',
  'bell',
]);

// Accept both `gold_*` (webmc registry per src/items/armor.ts) and
// `golden_*` (vanilla MC ID). Old set only listed `golden_*`, so
// piglinPassiveIfWearing never triggered for the actual registered
// armor IDs and piglins always aggroed players in gold armor.
const GOLD_ARMOR = new Set<string>([
  'gold_helmet',
  'gold_chestplate',
  'gold_leggings',
  'gold_boots',
  'golden_helmet',
  'golden_chestplate',
  'golden_leggings',
  'golden_boots',
]);

export function isGoldItem(id: string): boolean {
  return GOLD_ITEMS.has(id);
}

export function isGoldArmor(id: string): boolean {
  return GOLD_ARMOR.has(id);
}

export function piglinPassiveIfWearing(armor: readonly string[]): boolean {
  return armor.some((a) => GOLD_ARMOR.has(a));
}

export function barterable(id: string): boolean {
  return id === 'gold_ingot';
}
