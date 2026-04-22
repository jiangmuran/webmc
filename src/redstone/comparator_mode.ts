// Comparator. Two modes: COMPARE (output = back signal if back>=side, else 0)
// and SUBTRACT (output = max(0, back - max(sideA, sideB))). Also reads
// "container fullness" from a powered container behind it:
// signal = floor(14 * filledSlotFraction) + (any ? 1 : 0), capped 15.

export type CompareMode = 'compare' | 'subtract';

export interface ComparatorQuery {
  back: number;
  sideA: number;
  sideB: number;
  mode: CompareMode;
}

export function comparatorOut(q: ComparatorQuery): number {
  const side = Math.max(q.sideA, q.sideB);
  if (q.mode === 'compare') {
    return q.back >= side ? q.back : 0;
  }
  return Math.max(0, q.back - side);
}

export interface ContainerRead {
  totalSlots: number;
  filledSlots: number;
  stackFractionSum: number; // sum of (count/stackMax) over filled slots
}

export function containerSignal(c: ContainerRead): number {
  if (c.totalSlots === 0) return 0;
  if (c.filledSlots === 0) return 0;
  const avgFill = c.stackFractionSum / c.totalSlots;
  return Math.min(15, Math.floor(avgFill * 14) + 1);
}
