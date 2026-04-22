// Waterlogged block state. Many non-full blocks (slabs, stairs, fences,
// signs, chains, etc.) have a "waterlogged" boolean that makes water
// render inside the block and propagate outward.

const WATERLOGGABLE = new Set<string>([
  'webmc:oak_slab',
  'webmc:spruce_slab',
  'webmc:birch_slab',
  'webmc:dark_oak_slab',
  'webmc:jungle_slab',
  'webmc:acacia_slab',
  'webmc:cherry_slab',
  'webmc:mangrove_slab',
  'webmc:stone_slab',
  'webmc:cobblestone_slab',
  'webmc:brick_slab',
  'webmc:stone_brick_slab',
  'webmc:oak_stairs',
  'webmc:spruce_stairs',
  'webmc:birch_stairs',
  'webmc:dark_oak_stairs',
  'webmc:jungle_stairs',
  'webmc:acacia_stairs',
  'webmc:cherry_stairs',
  'webmc:mangrove_stairs',
  'webmc:stone_stairs',
  'webmc:cobblestone_stairs',
  'webmc:brick_stairs',
  'webmc:stone_brick_stairs',
  'webmc:oak_fence',
  'webmc:oak_fence_gate',
  'webmc:iron_bars',
  'webmc:ladder',
  'webmc:chain',
  'webmc:lantern',
  'webmc:soul_lantern',
  'webmc:scaffolding',
  'webmc:cobblestone_wall',
  'webmc:sign',
  'webmc:wall_sign',
  'webmc:hanging_sign',
  'webmc:wall_hanging_sign',
  'webmc:trapdoor',
  'webmc:glass_pane',
  'webmc:stained_glass_pane',
  'webmc:light_block',
  'webmc:conduit',
  'webmc:sea_pickle',
  'webmc:coral_fan',
  'webmc:coral_wall_fan',
  'webmc:kelp',
  'webmc:kelp_plant',
  'webmc:big_dripleaf',
  'webmc:small_dripleaf',
  'webmc:pointed_dripstone',
  'webmc:amethyst_cluster',
  'webmc:small_amethyst_bud',
  'webmc:medium_amethyst_bud',
  'webmc:large_amethyst_bud',
  'webmc:lightning_rod',
]);

export function isWaterloggable(blockId: string): boolean {
  return WATERLOGGABLE.has(blockId);
}

export interface WaterlogQuery {
  blockId: string;
  currentWaterlogged: boolean;
  interacting: 'place_water_source' | 'pick_up_water' | 'adjacent_water_flow' | null;
}

export interface WaterlogResult {
  newWaterlogged: boolean;
  consumedBucket: boolean;
  yieldedBucket: boolean;
}

export function applyWaterlog(q: WaterlogQuery): WaterlogResult {
  if (!isWaterloggable(q.blockId)) {
    return { newWaterlogged: false, consumedBucket: false, yieldedBucket: false };
  }
  switch (q.interacting) {
    case 'place_water_source':
      if (q.currentWaterlogged) {
        return { newWaterlogged: true, consumedBucket: false, yieldedBucket: false };
      }
      return { newWaterlogged: true, consumedBucket: true, yieldedBucket: false };
    case 'pick_up_water':
      if (!q.currentWaterlogged) {
        return { newWaterlogged: false, consumedBucket: false, yieldedBucket: false };
      }
      return { newWaterlogged: false, consumedBucket: false, yieldedBucket: true };
    case 'adjacent_water_flow':
      if (q.currentWaterlogged) {
        return { newWaterlogged: true, consumedBucket: false, yieldedBucket: false };
      }
      return { newWaterlogged: true, consumedBucket: false, yieldedBucket: false };
    case null:
      return {
        newWaterlogged: q.currentWaterlogged,
        consumedBucket: false,
        yieldedBucket: false,
      };
  }
}

// Whether a block in waterlogged state still lets water flow through.
// Most do (slabs, fences); some block it (light_block, conduit).
const BLOCKS_FLOW = new Set<string>(['webmc:light_block', 'webmc:conduit']);

export function blocksWaterFlow(blockId: string): boolean {
  return BLOCKS_FLOW.has(blockId);
}
