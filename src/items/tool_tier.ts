// Tool tiers: wood, stone, iron, gold, diamond, netherite.
// Each has a mining level determining which blocks drop.

export type ToolMaterial = 'wood' | 'stone' | 'iron' | 'gold' | 'diamond' | 'netherite';

export const MINING_LEVEL: Record<ToolMaterial, number> = {
  wood: 1,
  gold: 1,
  stone: 2,
  iron: 3,
  diamond: 4,
  netherite: 5,
};

export const BREAK_SPEED: Record<ToolMaterial, number> = {
  wood: 2,
  stone: 4,
  iron: 6,
  gold: 12,
  diamond: 8,
  netherite: 9,
};

export const DURABILITY: Record<ToolMaterial, number> = {
  wood: 59,
  stone: 131,
  iron: 250,
  gold: 32,
  diamond: 1561,
  netherite: 2031,
};

export function canMine(toolLevel: number, requiredLevel: number): boolean {
  return toolLevel >= requiredLevel;
}

export function requiredLevelFor(blockId: string): number {
  // Vanilla MC mining levels (Level 0 = no tool required to drop):
  //   4 = diamond pickaxe (obsidian, ancient_debris, netherite_block)
  //   3 = iron pickaxe (diamond/gold/redstone/emerald ores)
  //   2 = stone pickaxe (iron/lapis/copper, deepslate)
  //   1 = wood pickaxe (stone, coal, andesite, granite, diorite, brick blocks)
  //   0 = bare hand OK (wood, dirt, plants, wool, leaves, sand, gravel, ...)
  // Old default was 1, so every wood/dirt block silently dropped nothing
  // when the player had no tool — bare-fist log/dirt/sand all returned air.
  if (blockId === 'obsidian' || blockId === 'crying_obsidian') return 4;
  if (blockId === 'ancient_debris' || blockId === 'netherite_block') return 4;
  if (blockId === 'diamond_ore' || blockId === 'deepslate_diamond_ore') return 3;
  if (blockId === 'gold_ore' || blockId === 'deepslate_gold_ore') return 3;
  if (blockId === 'redstone_ore' || blockId === 'deepslate_redstone_ore') return 3;
  if (blockId === 'emerald_ore' || blockId === 'deepslate_emerald_ore') return 3;
  if (blockId === 'iron_ore' || blockId === 'deepslate_iron_ore') return 2;
  if (blockId === 'lapis_ore' || blockId === 'deepslate_lapis_ore') return 2;
  if (blockId === 'copper_ore' || blockId === 'deepslate_copper_ore') return 2;
  // Stone-family + bricks need wood-tier pickaxe to drop.
  if (
    blockId === 'stone' ||
    blockId === 'cobblestone' ||
    blockId === 'mossy_cobblestone' ||
    blockId === 'andesite' ||
    blockId === 'granite' ||
    blockId === 'diorite' ||
    blockId === 'polished_andesite' ||
    blockId === 'polished_granite' ||
    blockId === 'polished_diorite' ||
    blockId === 'smooth_stone' ||
    blockId === 'sandstone' ||
    blockId === 'red_sandstone' ||
    blockId === 'stone_bricks' ||
    blockId === 'mossy_stone_bricks' ||
    blockId === 'cracked_stone_bricks' ||
    blockId === 'chiseled_stone_bricks' ||
    blockId === 'bricks' ||
    blockId === 'nether_bricks' ||
    blockId === 'red_nether_bricks' ||
    blockId === 'end_stone' ||
    blockId === 'end_stone_bricks' ||
    blockId === 'prismarine' ||
    blockId === 'prismarine_bricks' ||
    blockId === 'dark_prismarine' ||
    blockId === 'purpur_block' ||
    blockId === 'purpur_pillar' ||
    blockId === 'quartz_block' ||
    blockId === 'quartz_pillar' ||
    blockId === 'quartz_bricks' ||
    blockId === 'chiseled_quartz_block' ||
    blockId === 'smooth_quartz' ||
    blockId === 'coal_ore' ||
    blockId === 'deepslate_coal_ore' ||
    blockId === 'nether_quartz_ore' ||
    blockId === 'nether_gold_ore' ||
    blockId === 'magma_block' ||
    blockId === 'glowstone' ||
    blockId === 'sea_lantern' ||
    blockId === 'iron_block' ||
    blockId === 'gold_block' ||
    blockId === 'diamond_block' ||
    blockId === 'emerald_block' ||
    blockId === 'lapis_block' ||
    blockId === 'redstone_block' ||
    blockId === 'coal_block' ||
    blockId === 'copper_block' ||
    blockId === 'amethyst_block' ||
    blockId === 'amethyst_cluster' ||
    blockId === 'basalt' ||
    blockId === 'blackstone' ||
    blockId === 'deepslate' ||
    blockId === 'cobbled_deepslate'
  ) {
    return 1;
  }
  // Everything else (logs, planks, dirt, sand, leaves, wool, glass-as-dropped,
  // crops, flowers, snow, ...) drops freely with bare hands.
  return 0;
}
