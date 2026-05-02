// Shovel path. Right-click grass → dirt path; right-click campfire →
// extinguish (keep campfire placed); right-click rooted dirt → drops
// hanging_roots AND converts the block to dirt.
//
// Wiki (minecraft.wiki/w/Shovel): "Using a shovel on rooted dirt
// converts it to dirt and drops 1 hanging roots." Old hanging_roots
// action only carried the drop list, not the destination block — the
// caller could not tell that the rooted_dirt should be replaced with
// dirt, so the block stayed as rooted_dirt and the player kept
// generating infinite hanging roots from a single shoveled block.

export type ShovelAction =
  | { kind: 'place_path'; newBlock: 'webmc:dirt_path' }
  | { kind: 'extinguish_campfire' }
  | { kind: 'hanging_roots'; newBlock: 'webmc:dirt'; drops: readonly string[] }
  | { kind: 'none' };

export interface ShovelQuery {
  targetBlockName: string;
  airAbove: boolean;
  campfireLit: boolean;
}

// Wiki: shovels convert grass_block, dirt, coarse_dirt, podzol, mycelium
// into dirt_path. Was grass_block-only — players couldn't make paths
// from dirt or biome variants. rooted_dirt is special: drops hanging_roots
// AND turns into dirt (not dirt_path).
const PATH_TARGETS = new Set([
  'webmc:grass_block',
  'webmc:dirt',
  'webmc:coarse_dirt',
  'webmc:podzol',
  'webmc:mycelium',
]);

export function useShovel(q: ShovelQuery): ShovelAction {
  if (PATH_TARGETS.has(q.targetBlockName) && q.airAbove) {
    return { kind: 'place_path', newBlock: 'webmc:dirt_path' };
  }
  if (q.targetBlockName === 'webmc:campfire' && q.campfireLit) {
    return { kind: 'extinguish_campfire' };
  }
  if (q.targetBlockName === 'webmc:rooted_dirt' && q.airAbove) {
    return { kind: 'hanging_roots', newBlock: 'webmc:dirt', drops: ['webmc:hanging_roots'] };
  }
  return { kind: 'none' };
}
