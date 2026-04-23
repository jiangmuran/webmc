// Redstone dust signal propagation. Source = 15; drops by 1 per wire.
// Comparator/repeater re-emit 15; levers/buttons source 15.

export interface WireCtx {
  sourceLevel: number; // neighbor max
  attenuation: number; // 1 per wire
}

export function levelAfterWire(c: WireCtx): number {
  return Math.max(0, c.sourceLevel - c.attenuation);
}

export function maxOfNeighbors(levels: number[]): number {
  let m = 0;
  for (const l of levels) if (l > m) m = l;
  return m;
}

export function isFull(level: number): boolean {
  return level >= 15;
}

export const DUST_MAX = 15;
export const WIRE_ATTENUATION = 1;

export function dustPropagates(level: number): number {
  return Math.max(0, Math.min(DUST_MAX, level) - WIRE_ATTENUATION);
}
