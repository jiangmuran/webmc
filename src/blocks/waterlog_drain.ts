// Waterlogged block behavior. Fence/slab/stair/etc. can hold water
// simultaneously with the block. Draining: remove water, leave block.

export interface WaterloggedBlock {
  blockId: string;
  waterlogged: boolean;
}

export function canWaterlog(blockId: string): boolean {
  // Non-solid one-voxel blocks that MC supports.
  return (
    blockId.endsWith('_slab') ||
    blockId.endsWith('_stairs') ||
    blockId.endsWith('_fence') ||
    blockId.endsWith('_wall') ||
    blockId === 'iron_bars' ||
    blockId === 'glass_pane' ||
    blockId === 'chain' ||
    blockId === 'scaffolding' ||
    blockId === 'ladder'
  );
}

export function placeInWater(b: WaterloggedBlock): WaterloggedBlock {
  if (!canWaterlog(b.blockId)) return b;
  return { ...b, waterlogged: true };
}

export function bucketDrain(b: WaterloggedBlock): { block: WaterloggedBlock; picked: boolean } {
  if (!b.waterlogged) return { block: b, picked: false };
  return { block: { ...b, waterlogged: false }, picked: true };
}

export function bucketFill(b: WaterloggedBlock): { block: WaterloggedBlock; used: boolean } {
  if (!canWaterlog(b.blockId)) return { block: b, used: false };
  if (b.waterlogged) return { block: b, used: false };
  return { block: { ...b, waterlogged: true }, used: true };
}
