// Shovel path. Right-click grass → dirt path; right-click campfire →
// extinguish (keep campfire placed); right-click rooted dirt → hanging
// roots drop.

export type ShovelAction =
  | { kind: 'place_path'; newBlock: 'webmc:dirt_path' }
  | { kind: 'extinguish_campfire' }
  | { kind: 'hanging_roots'; drops: readonly string[] }
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
    return { kind: 'hanging_roots', drops: ['webmc:hanging_roots'] };
  }
  return { kind: 'none' };
}
