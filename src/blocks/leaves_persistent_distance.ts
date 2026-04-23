export interface LeavesCtx {
  persistent: boolean;
  distance: number;
}

export const MAX_DISTANCE = 6;

export function decays(c: LeavesCtx): boolean {
  return !c.persistent && c.distance > MAX_DISTANCE;
}

export function placedByHand(): LeavesCtx {
  return { persistent: true, distance: 7 };
}

export function naturalFromTree(distance: number): LeavesCtx {
  return { persistent: false, distance };
}
