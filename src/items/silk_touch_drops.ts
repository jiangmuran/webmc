// Silk Touch enchantment. Drops the block itself rather than its normal
// drops. Incompatible with Fortune.

export const SILK_TOUCH_BLOCKS = new Set<string>([
  'coal_ore',
  'diamond_ore',
  'emerald_ore',
  'redstone_ore',
  'lapis_ore',
  'nether_quartz_ore',
  'copper_ore',
  'glass',
  'ice',
  'packed_ice',
  'blue_ice',
  'grass_block',
  'mycelium',
  'podzol',
  'sea_lantern',
  'glowstone',
  'amethyst_cluster',
  'spawner',
  'stone',
  'campfire',
  'gilded_blackstone',
]);

export function silkDropsBlockItself(blockId: string): boolean {
  return SILK_TOUCH_BLOCKS.has(blockId);
}

export function incompatibleWithFortune(): boolean {
  return true;
}

export function dropIdFor(blockId: string): string {
  if (blockId === 'grass_block') return 'grass_block';
  if (blockId === 'stone') return 'stone';
  return blockId;
}
