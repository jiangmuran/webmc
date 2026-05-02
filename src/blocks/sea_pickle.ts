// Sea pickle. 1..4 pickles per block; light emission per wiki is
// 6/9/12/15 (formula: 3 + count*3). Only emits light if submerged.
// Duplicates on bone meal when coral block underneath.

export interface SeaPickleState {
  count: 1 | 2 | 3 | 4;
  inWater: boolean;
}

export function makeSeaPickle(count: 1 | 2 | 3 | 4 = 1, inWater = true): SeaPickleState {
  return { count, inWater };
}

export function lightEmission(state: SeaPickleState): number {
  if (!state.inWater) return 0;
  // Wiki: 1 pickle = light 6, 2 = 9, 3 = 12, 4 = 15. Was count * 3
  // (= 3/6/9/12), off by 3 across the board.
  return 3 + state.count * 3;
}

export function addPickle(state: SeaPickleState): boolean {
  if (state.count >= 4) return false;
  state.count = (state.count + 1) as SeaPickleState['count'];
  return true;
}

// Bone meal on a full pickle atop coral → spreads to neighbouring cells.
export interface BoneMealQuery {
  state: SeaPickleState;
  onCoralBlock: boolean;
  rng: () => number;
}

export interface BoneMealResult {
  duplicates: number;
}

// Wiki (minecraft.wiki/w/Sea_Pickle#Growing): "any living coral block
// within a taxicab distance of 2 blocks (horizontally from either the
// coral block or the sea pickle itself) can generate 1-3 sea pickles."
// Old formula `2 + Math.floor(rng()*3)` gave 2-4 — high by 1 across
// the range.
export function boneMealPickle(q: BoneMealQuery): BoneMealResult {
  if (!q.onCoralBlock || q.state.count !== 4) return { duplicates: 0 };
  const count = 1 + Math.floor(q.rng() * 3); // 1-3 per wiki
  return { duplicates: count };
}
