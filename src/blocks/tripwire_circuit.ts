// Tripwire as a logic circuit element. 2-input XOR across pairs of
// tripwires (2 hooks each): signal goes high when exactly one pair is
// active. Useful in redstone automation.

export interface TripwirePair {
  hookA: boolean;
  hookB: boolean;
}

// OR across the two hooks of one line.
export function lineActive(t: TripwirePair): boolean {
  return t.hookA || t.hookB;
}

// XOR across 2 lines (tripped-on-one-side-only).
export function xorPair(a: TripwirePair, b: TripwirePair): boolean {
  return lineActive(a) !== lineActive(b);
}

// Sum of activations across multiple tripwires — useful for a
// "count-based" redstone signal via comparator reading from a
// redstone-dust combiner.
export function countActive(pairs: TripwirePair[]): number {
  return pairs.filter(lineActive).length;
}

// Signal strength in 0..15 based on active count.
export function signalFromCount(n: number): number {
  return Math.min(15, Math.max(0, n));
}
