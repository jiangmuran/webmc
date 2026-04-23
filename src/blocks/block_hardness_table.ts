const HARDNESS: Record<string, number> = {
  air: 0,
  dirt: 0.5,
  grass_block: 0.6,
  sand: 0.5,
  gravel: 0.6,
  glass: 0.3,
  cobblestone: 2,
  stone: 1.5,
  deepslate: 3.5,
  tuff: 1.5,
  oak_log: 2,
  oak_planks: 2,
  iron_ore: 3,
  deepslate_iron_ore: 4.5,
  diamond_ore: 3,
  deepslate_diamond_ore: 4.5,
  obsidian: 50,
  crying_obsidian: 50,
  bedrock: -1,
  ancient_debris: 30,
  netherite_block: 50,
  wool: 0.8,
  melon: 1,
  sea_lantern: 0.3,
  ender_chest: 22.5,
  reinforced_deepslate: 55,
};

export function blockHardness(id: string): number {
  return HARDNESS[id] ?? 0;
}

export function isUnbreakable(id: string): boolean {
  return blockHardness(id) < 0;
}

export function blastResistance(id: string): number {
  if (id === 'obsidian' || id === 'crying_obsidian') return 1200;
  if (id === 'bedrock' || id === 'end_portal_frame') return 3600000;
  if (id === 'netherite_block') return 1200;
  if (id === 'ancient_debris') return 1200;
  if (id === 'reinforced_deepslate') return 1200;
  return Math.max(0, blockHardness(id) * 5);
}
