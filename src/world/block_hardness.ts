// Block hardness table keyed by webmc block id. Hardness is used by
// mining-speed.ts to compute break time; -1 means unbreakable in
// survival; 0 is "breaks instantly".

import type { BlockMaterial } from '@/items/mining-speed';

export interface BlockMiningSpec {
  hardness: number;
  material: BlockMaterial;
}

const TABLE: Record<string, BlockMiningSpec> = {
  'webmc:air': { hardness: 0, material: 'other' },
  'webmc:stone': { hardness: 1.5, material: 'stone' },
  'webmc:cobblestone': { hardness: 2.0, material: 'stone' },
  'webmc:dirt': { hardness: 0.5, material: 'dirt' },
  'webmc:grass_block': { hardness: 0.6, material: 'dirt' },
  'webmc:sand': { hardness: 0.5, material: 'sand' },
  'webmc:gravel': { hardness: 0.6, material: 'sand' },
  'webmc:oak_log': { hardness: 2.0, material: 'wood' },
  'webmc:oak_planks': { hardness: 2.0, material: 'wood' },
  'webmc:oak_leaves': { hardness: 0.2, material: 'leaves' },
  'webmc:glass': { hardness: 0.3, material: 'glass' },
  'webmc:iron_ore': { hardness: 3.0, material: 'stone' },
  'webmc:gold_ore': { hardness: 3.0, material: 'stone' },
  'webmc:diamond_ore': { hardness: 3.0, material: 'stone' },
  'webmc:emerald_ore': { hardness: 3.0, material: 'stone' },
  'webmc:coal_ore': { hardness: 3.0, material: 'stone' },
  'webmc:redstone_ore': { hardness: 3.0, material: 'stone' },
  'webmc:lapis_ore': { hardness: 3.0, material: 'stone' },
  'webmc:obsidian': { hardness: 50, material: 'obsidian' },
  'webmc:crying_obsidian': { hardness: 50, material: 'obsidian' },
  'webmc:bedrock': { hardness: -1, material: 'unbreakable' },
  'webmc:barrier': { hardness: -1, material: 'unbreakable' },
  'webmc:wool_white': { hardness: 0.8, material: 'wool' },
  'webmc:cobweb': { hardness: 4.0, material: 'web' },
  'webmc:iron_block': { hardness: 5.0, material: 'stone' },
  'webmc:gold_block': { hardness: 3.0, material: 'stone' },
  'webmc:diamond_block': { hardness: 5.0, material: 'stone' },
  'webmc:netherite_block': { hardness: 50, material: 'stone' },
  'webmc:ancient_debris': { hardness: 30, material: 'stone' },
  'webmc:end_stone': { hardness: 3.0, material: 'stone' },
  'webmc:netherrack': { hardness: 0.4, material: 'stone' },
  'webmc:soul_sand': { hardness: 0.5, material: 'sand' },
  'webmc:soul_soil': { hardness: 0.5, material: 'dirt' },
  'webmc:glowstone': { hardness: 0.3, material: 'glass' },
  'webmc:reinforced_deepslate': { hardness: 55, material: 'stone' },
  'webmc:deepslate': { hardness: 3.0, material: 'stone' },
  'webmc:cobbled_deepslate': { hardness: 3.5, material: 'stone' },
};

export function hardnessOf(blockId: string): number {
  return TABLE[blockId]?.hardness ?? 1.0;
}

export function materialOf(blockId: string): BlockMaterial {
  return TABLE[blockId]?.material ?? 'other';
}

export function isUnbreakable(blockId: string): boolean {
  return hardnessOf(blockId) < 0;
}

export function miningSpecOf(blockId: string): BlockMiningSpec {
  return TABLE[blockId] ?? { hardness: 1.0, material: 'other' };
}

export function registerHardness(blockId: string, spec: BlockMiningSpec): void {
  TABLE[blockId] = spec;
}
