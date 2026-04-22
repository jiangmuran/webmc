// Shears. Breaks leaves/cobwebs/wool/grass instantly as drops (not debris).
// Shears sheep/mooshroom/bogged/snowgolem. Efficient enchantment applies.

export type ShearableBlock =
  | 'oak_leaves'
  | 'spruce_leaves'
  | 'birch_leaves'
  | 'cobweb'
  | 'vine'
  | 'tall_grass'
  | 'fern'
  | 'grass'
  | 'seagrass'
  | 'glow_lichen';

const ALL_SHEARABLE_BLOCKS = new Set<ShearableBlock>([
  'oak_leaves',
  'spruce_leaves',
  'birch_leaves',
  'cobweb',
  'vine',
  'tall_grass',
  'fern',
  'grass',
  'seagrass',
  'glow_lichen',
]);

export function isShearableBlock(id: string): id is ShearableBlock {
  return ALL_SHEARABLE_BLOCKS.has(id as ShearableBlock);
}

export type ShearableMob = 'sheep' | 'mooshroom' | 'bogged' | 'snow_golem';

export function canShearMob(mobType: string): mobType is ShearableMob {
  return (
    mobType === 'sheep' ||
    mobType === 'mooshroom' ||
    mobType === 'bogged' ||
    mobType === 'snow_golem'
  );
}

export const SHEARS_DURABILITY = 238;
export const SHEARS_USE_COST = 1;
