export const MAX_DISTANCE = 7;

export interface LeafState {
  persistent: boolean;
  distance: number;
}

export function shouldDecay(s: LeafState): boolean {
  return !s.persistent && s.distance >= MAX_DISTANCE;
}

export function computeDistance(
  neighborDistances: readonly number[],
  hasLogNeighbor: boolean,
): number {
  if (hasLogNeighbor) return 1;
  let min = MAX_DISTANCE;
  for (const d of neighborDistances) {
    if (d < min) min = d;
  }
  return Math.min(MAX_DISTANCE, min + 1);
}
