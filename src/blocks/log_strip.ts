export const STRIPPABLE = new Set([
  'oak_log',
  'spruce_log',
  'birch_log',
  'jungle_log',
  'acacia_log',
  'dark_oak_log',
  'mangrove_log',
  'cherry_log',
  'pale_oak_log',
  'bamboo_block',
  'crimson_stem',
  'warped_stem',
  'oak_wood',
  'spruce_wood',
  'birch_wood',
  'jungle_wood',
  'acacia_wood',
  'dark_oak_wood',
  'mangrove_wood',
  'cherry_wood',
  'pale_oak_wood',
]);

export function canStrip(block: string): boolean {
  return STRIPPABLE.has(block);
}

export function strippedOf(block: string): string | undefined {
  if (!canStrip(block)) return undefined;
  return `stripped_${block}`;
}

export function axeRequired(): boolean {
  return true;
}
