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
  if (blockId === 'obsidian' || blockId === 'crying_obsidian') return 4;
  if (blockId === 'ancient_debris' || blockId === 'netherite_block') return 4;
  if (blockId === 'diamond_ore' || blockId === 'deepslate_diamond_ore') return 3;
  if (blockId === 'gold_ore' || blockId === 'deepslate_gold_ore') return 3;
  if (blockId === 'redstone_ore' || blockId === 'deepslate_redstone_ore') return 3;
  if (blockId === 'emerald_ore' || blockId === 'deepslate_emerald_ore') return 3;
  if (blockId === 'iron_ore' || blockId === 'deepslate_iron_ore') return 2;
  if (blockId === 'lapis_ore' || blockId === 'deepslate_lapis_ore') return 2;
  if (blockId === 'copper_ore' || blockId === 'deepslate_copper_ore') return 2;
  return 1;
}
