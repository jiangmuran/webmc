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

export function useShovel(q: ShovelQuery): ShovelAction {
  if (q.targetBlockName === 'webmc:grass_block' && q.airAbove) {
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
