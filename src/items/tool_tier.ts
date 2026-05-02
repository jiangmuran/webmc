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

// Memoize the level lookup. Was running ~50 string comparisons per
// call from getBreakDurationSec (per frame while breaking) for a
// stable per-block result. Cache grows only with distinct block names.
const REQUIRED_LEVEL_CACHE = new Map<string, number>();
export function requiredLevelFor(blockId: string): number {
  const cached = REQUIRED_LEVEL_CACHE.get(blockId);
  if (cached !== undefined) return cached;
  const result = computeRequiredLevelFor(blockId);
  REQUIRED_LEVEL_CACHE.set(blockId, result);
  return result;
}
function computeRequiredLevelFor(blockId: string): number {
  // Vanilla MC mining levels. Tool levels: bare=0, wood/gold=1, stone=2,
  // iron=3, diamond=4, netherite=5. canMine = toolLevel >= requiredLevel.
  //   4 = diamond pickaxe (obsidian, ancient_debris, netherite_block,
  //       respawn_anchor, crying_obsidian)
  //   3 = iron pickaxe (diamond/gold/redstone/emerald ores AND their
  //       block forms — wiki: block-of-X needs same tier as ore-of-X)
  //   2 = stone pickaxe (iron/lapis/copper ores AND iron_block/copper_block,
  //       deepslate)
  //   1 = wood pickaxe (stone, cobblestone, coal_ore, andesite, granite,
  //       diorite, bricks, nether_quartz_ore, magma_block, amethyst_block,
  //       lapis_block, redstone_block, coal_block)
  //   0 = bare hand OK (wood, dirt, plants, wool, leaves, sand, gravel,
  //       glowstone, sea_lantern, ...)
  // Wiki-spec fix: iron_block/gold_block/diamond_block/emerald_block/
  // copper_block were previously all level 1 (wood). Now match their
  // ore tier. Also: glowstone + sea_lantern were level 1, now level 0
  // (wiki: drop with no tool).
  if (blockId === 'obsidian' || blockId === 'crying_obsidian') return 4;
  if (blockId === 'ancient_debris' || blockId === 'netherite_block') return 4;
  if (blockId === 'respawn_anchor') return 4;
  if (blockId === 'diamond_ore' || blockId === 'deepslate_diamond_ore') return 3;
  if (blockId === 'gold_ore' || blockId === 'deepslate_gold_ore') return 3;
  if (blockId === 'redstone_ore' || blockId === 'deepslate_redstone_ore') return 3;
  if (blockId === 'emerald_ore' || blockId === 'deepslate_emerald_ore') return 3;
  // Block forms of valuable metals require the same tier as the ore.
  if (blockId === 'diamond_block') return 3;
  if (blockId === 'gold_block') return 3;
  if (blockId === 'emerald_block') return 3;
  if (blockId === 'iron_ore' || blockId === 'deepslate_iron_ore') return 2;
  if (blockId === 'lapis_ore' || blockId === 'deepslate_lapis_ore') return 2;
  if (blockId === 'copper_ore' || blockId === 'deepslate_copper_ore') return 2;
  // iron_block and copper_block also need stone-tier per wiki.
  if (blockId === 'iron_block' || blockId === 'copper_block') return 2;
  // Stone-family + bricks need wood-tier pickaxe to drop. Excludes
  // glowstone, sea_lantern, redstone_block, coal_block: those are
  // bare-hand droppable per wiki.
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
    blockId === 'lapis_block' ||
    blockId === 'redstone_block' ||
    blockId === 'coal_block' ||
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
  // crops, flowers, snow, glowstone, sea_lantern, ...) drops freely with
  // bare hands. Wiki: glowstone + sea_lantern explicitly drop with no
  // tool; were incorrectly requiring wood pickaxe.
  return 0;
}
