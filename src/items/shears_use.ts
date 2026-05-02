// Shears. Breaks leaves/cobwebs/wool/grass instantly as drops (not debris).
// Shears sheep/mooshroom/bogged/snowgolem. Efficient enchantment applies.
//
// Wiki (minecraft.wiki/w/Shears#Usage): the canonical block list spans
// every leaves variant (10 wood types + azalea pair), all small grass
// and fern variants, both seagrasses, all three vine types (vine,
// weeping_vines, twisting_vines), glow_lichen, hanging_roots, and
// cobweb. Old set only had 3 leaf variants (oak/spruce/birch), missing
// 7+ wood types that have shipped since 1.7 (jungle/acacia/dark_oak),
// 1.16 (the pair of azaleas), 1.19 (mangrove), 1.20 (cherry), and
// 1.21.5 (pale_oak), plus weeping/twisting vines and hanging_roots.

export type ShearableBlock =
  | 'oak_leaves'
  | 'spruce_leaves'
  | 'birch_leaves'
  | 'jungle_leaves'
  | 'acacia_leaves'
  | 'dark_oak_leaves'
  | 'mangrove_leaves'
  | 'cherry_leaves'
  | 'pale_oak_leaves'
  | 'azalea_leaves'
  | 'flowering_azalea_leaves'
  | 'cobweb'
  | 'vine'
  | 'weeping_vines'
  | 'twisting_vines'
  | 'tall_grass'
  | 'large_fern'
  | 'fern'
  | 'short_grass'
  | 'grass'
  | 'seagrass'
  | 'tall_seagrass'
  | 'glow_lichen'
  | 'hanging_roots';

const ALL_SHEARABLE_BLOCKS = new Set<ShearableBlock>([
  'oak_leaves',
  'spruce_leaves',
  'birch_leaves',
  'jungle_leaves',
  'acacia_leaves',
  'dark_oak_leaves',
  'mangrove_leaves',
  'cherry_leaves',
  'pale_oak_leaves',
  'azalea_leaves',
  'flowering_azalea_leaves',
  'cobweb',
  'vine',
  'weeping_vines',
  'twisting_vines',
  'tall_grass',
  'large_fern',
  'fern',
  'short_grass',
  'grass',
  'seagrass',
  'tall_seagrass',
  'glow_lichen',
  'hanging_roots',
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
