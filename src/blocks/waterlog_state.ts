// Waterlogged block state. Many non-full blocks (slabs, stairs,
// fences, glass panes, signs, trapdoors) can carry a water flag. The
// water source acts like a waterlogged cell.

const WATERLOGGABLE = new Set<string>([
  'slab',
  'stairs',
  'fence',
  'fence_gate',
  'wall',
  'glass_pane',
  'iron_bars',
  'sign',
  'wall_sign',
  'trapdoor',
  'ladder',
  'conduit',
  'campfire',
  'candle',
  'cauldron_with_powder_snow',
  'chain',
  'chest',
  'trapped_chest',
  'hopper',
  'sea_pickle',
  'lightning_rod',
]);

export function isWaterloggable(shapeTag: string): boolean {
  return WATERLOGGABLE.has(shapeTag);
}

export interface WaterlogQuery {
  shapeTag: string;
  currentlyWaterlogged: boolean;
  placingWaterBucket: boolean;
  placingBlockWithWaterPresent: boolean;
}

export function computeWaterlog(q: WaterlogQuery): boolean {
  if (!isWaterloggable(q.shapeTag)) return false;
  if (q.placingWaterBucket) return true;
  if (q.placingBlockWithWaterPresent) return true;
  return q.currentlyWaterlogged;
}

// When a waterlogged block is removed, a water block remains.
export function onRemove(wasWaterlogged: boolean): 'air' | 'water' {
  return wasWaterlogged ? 'water' : 'air';
}
