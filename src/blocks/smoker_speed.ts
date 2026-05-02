// Smoker + blast furnace. 2× faster than a regular furnace but only
// accepts a restricted subset of ingredients:
//   smoker: food (raw meat, fish, potatoes, dried kelp, etc.)
//   blast_furnace: metals (iron/gold ore, chainmail armor, ancient debris)

export type SmelterKind = 'furnace' | 'smoker' | 'blast_furnace';

export const FURNACE_SMELT_SEC = 10;
export const FAST_SMELT_SEC = FURNACE_SMELT_SEC / 2; // 5s

export function smeltDuration(kind: SmelterKind): number {
  return kind === 'furnace' ? FURNACE_SMELT_SEC : FAST_SMELT_SEC;
}

const SMOKER_INPUTS = new Set<string>([
  'webmc:raw_beef',
  'webmc:raw_chicken',
  'webmc:raw_porkchop',
  'webmc:raw_mutton',
  'webmc:raw_rabbit',
  'webmc:cod',
  'webmc:salmon',
  'webmc:potato',
  'webmc:kelp',
]);

const BLAST_INPUTS = new Set<string>([
  'webmc:iron_ore',
  'webmc:gold_ore',
  'webmc:copper_ore',
  'webmc:raw_iron',
  'webmc:raw_gold',
  'webmc:raw_copper',
  'webmc:ancient_debris',
  'webmc:iron_sword',
  'webmc:iron_pickaxe',
  'webmc:iron_axe',
  'webmc:iron_shovel',
  'webmc:iron_hoe',
  'webmc:iron_helmet',
  'webmc:iron_chestplate',
  'webmc:iron_leggings',
  'webmc:iron_boots',
  'webmc:chainmail_helmet',
  'webmc:chainmail_chestplate',
  'webmc:chainmail_leggings',
  'webmc:chainmail_boots',
  'webmc:nether_gold_ore',
  'webmc:gold_sword',
  'webmc:gold_pickaxe',
  'webmc:gold_axe',
  'webmc:gold_shovel',
  'webmc:gold_hoe',
  'webmc:gold_helmet',
  'webmc:gold_chestplate',
  'webmc:gold_leggings',
  'webmc:gold_boots',
]);

export function canAccept(kind: SmelterKind, input: string): boolean {
  if (kind === 'furnace') return true;
  if (kind === 'smoker') return SMOKER_INPUTS.has(input);
  return BLAST_INPUTS.has(input);
}

// Smelt result table — all three smelters share outputs when they
// accept the input; speed differs only by kind. Old table omitted
// raw_mutton + raw_rabbit, so a player smoking lamb/rabbit got
// `smeltOutput()` returning null and no cooked food. Wiki
// (minecraft.wiki/w/Smelting#Inputs) lists both as canonical
// smelter+furnace inputs.
const SMELT_OUTPUTS: Record<string, string> = {
  'webmc:raw_beef': 'webmc:cooked_beef',
  'webmc:raw_chicken': 'webmc:cooked_chicken',
  'webmc:raw_porkchop': 'webmc:cooked_porkchop',
  'webmc:raw_mutton': 'webmc:cooked_mutton',
  'webmc:raw_rabbit': 'webmc:cooked_rabbit',
  'webmc:cod': 'webmc:cooked_cod',
  'webmc:salmon': 'webmc:cooked_salmon',
  'webmc:potato': 'webmc:baked_potato',
  'webmc:kelp': 'webmc:dried_kelp',
  'webmc:iron_ore': 'webmc:iron_ingot',
  'webmc:gold_ore': 'webmc:gold_ingot',
  'webmc:copper_ore': 'webmc:copper_ingot',
  'webmc:raw_iron': 'webmc:iron_ingot',
  'webmc:raw_gold': 'webmc:gold_ingot',
  'webmc:raw_copper': 'webmc:copper_ingot',
  'webmc:nether_gold_ore': 'webmc:gold_ingot',
  'webmc:ancient_debris': 'webmc:netherite_scrap',
  'webmc:sand': 'webmc:glass',
  'webmc:cobblestone': 'webmc:stone',
  'webmc:stone': 'webmc:smooth_stone',
};

export function smeltOutput(input: string): string | null {
  return SMELT_OUTPUTS[input] ?? null;
}
