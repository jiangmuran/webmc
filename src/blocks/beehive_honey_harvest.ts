// Beehive honey harvest. Honey level 0..5; at 5, shears give honeycomb
// (3), bottle gives honey bottle. Harvesting angers nearby bees unless
// campfire smoke beneath.

export interface Beehive {
  honeyLevel: number; // 0..5
  beeCount: number;
}

export const MAX_HONEY = 5;
export const MAX_BEES = 3;

export type HarvestTool = 'shears' | 'bottle' | 'none';

export interface HarvestQuery {
  tool: HarvestTool;
  campfireBelow: boolean;
}

export type HarvestResult =
  | { kind: 'empty' }
  | {
      kind: 'ok';
      item: 'webmc:honeycomb' | 'webmc:honey_bottle';
      count: number;
      anger: boolean;
    };

export function harvest(h: Beehive, q: HarvestQuery): HarvestResult {
  if (h.honeyLevel < MAX_HONEY) return { kind: 'empty' };
  if (q.tool === 'none') return { kind: 'empty' };
  h.honeyLevel = 0;
  if (q.tool === 'shears') {
    return {
      kind: 'ok',
      item: 'webmc:honeycomb',
      count: 3,
      anger: !q.campfireBelow,
    };
  }
  return {
    kind: 'ok',
    item: 'webmc:honey_bottle',
    count: 1,
    anger: !q.campfireBelow,
  };
}

// Bees periodically drop pollen → honeyLevel++
export function pollinateTick(h: Beehive): boolean {
  if (h.honeyLevel >= MAX_HONEY) return false;
  h.honeyLevel += 1;
  return true;
}
