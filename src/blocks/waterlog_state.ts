// Waterlogged block state. Many non-full blocks (slabs, stairs,
// fences, glass panes, signs, trapdoors) can carry a water flag. The
// water source acts like a waterlogged cell.

// Wiki: each block's article lists "Waterloggable: yes" in its
// infobox. minecraft.wiki/w/Waterlogging enumerates the canonical set.
// Missing from the old set: lantern + soul_lantern (1.17), hanging
// sign + wall hanging sign (1.20), scaffolding, light_block, coral
// fans, pointed dripstone, amethyst cluster + buds, small/big
// dripleaf, kelp/kelp_plant. Sibling waterlogged_state.ts already
// listed these by full block id; harmonized to the same coverage.
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
  'hanging_sign',
  'wall_hanging_sign',
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
  'lantern',
  'soul_lantern',
  'scaffolding',
  'light_block',
  'coral_fan',
  'coral_wall_fan',
  'pointed_dripstone',
  'amethyst_cluster',
  'small_amethyst_bud',
  'medium_amethyst_bud',
  'large_amethyst_bud',
  'small_dripleaf',
  'big_dripleaf',
  'kelp',
  'kelp_plant',
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
