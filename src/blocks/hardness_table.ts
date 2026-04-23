// Block hardness table. Lookup used by break-speed formula.

const H: Record<string, number> = {
  air: 0,
  bedrock: -1,
  obsidian: 50,
  crying_obsidian: 50,
  diamond_ore: 3,
  iron_ore: 3,
  gold_ore: 3,
  stone: 1.5,
  cobblestone: 2,
  dirt: 0.5,
  grass_block: 0.6,
  sand: 0.5,
  gravel: 0.6,
  clay: 0.6,
  oak_log: 2,
  oak_planks: 2,
  oak_leaves: 0.2,
  wool: 0.8,
  glass: 0.3,
  iron_block: 5,
  diamond_block: 5,
  netherite_block: 50,
  ancient_debris: 30,
  end_stone: 3,
  netherrack: 0.4,
  soul_sand: 0.5,
  soul_soil: 0.5,
};

export function hardnessOf(id: string): number {
  return H[id] ?? 1;
}

export function unbreakable(id: string): boolean {
  return hardnessOf(id) < 0;
}

export function instantMine(id: string): boolean {
  return hardnessOf(id) === 0;
}
