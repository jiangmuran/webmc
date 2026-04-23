// Chorus plant growth. Planted on end stone; grows in branching vertical
// columns up to 5 blocks high; terminal is chorus_fruit_flower.

export interface ChorusNode {
  height: number;
  isFlower: boolean;
  branchCount: number;
}

export const CHORUS_MAX_HEIGHT = 5;
export const BRANCH_PROB_BASE = 0.75;

export function tryGrowUp(n: ChorusNode, rand: () => number): ChorusNode {
  if (n.isFlower) return n;
  if (n.height >= CHORUS_MAX_HEIGHT) return { ...n, isFlower: true };
  if (rand() < 0.3) return { ...n, isFlower: true };
  return { ...n, height: n.height + 1 };
}

export function branchCountForHeight(h: number, rand: () => number): number {
  const p = Math.max(0.1, BRANCH_PROB_BASE - h * 0.1);
  let count = 0;
  for (let i = 0; i < 4; i++) if (rand() < p) count++;
  return count;
}

export function breakPropagates(): boolean {
  // Breaking a chorus plant cascades upward to all connected plants.
  return true;
}
