// Cake block. 7 bites; each bite gives 2 hunger. Empty cake removed.

export interface Cake {
  bitesRemaining: 7 | 6 | 5 | 4 | 3 | 2 | 1;
}

export const TOTAL_BITES = 7;

export type BiteResult =
  | { kind: 'ate'; cake: Cake; hungerGained: number; saturationGained: number }
  | { kind: 'removed' }
  | { kind: 'not_hungry' };

export function bite(c: Cake, hungerFull: boolean): BiteResult {
  if (hungerFull) return { kind: 'not_hungry' };
  const nextBites = c.bitesRemaining - 1;
  if (nextBites <= 0) return { kind: 'removed' };
  return {
    kind: 'ate',
    cake: { bitesRemaining: nextBites as Cake['bitesRemaining'] },
    hungerGained: 2,
    saturationGained: 0.4,
  };
}

export function craftCake(): Cake {
  return { bitesRemaining: TOTAL_BITES };
}

export function canWaxToKeep(): boolean {
  return false;
}
