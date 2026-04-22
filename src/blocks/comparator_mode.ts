// Redstone comparator. Two modes: compare (pass if side ≤ back),
// subtract (back - side). Reads container fullness as signal on back.

export type ComparatorMode = 'compare' | 'subtract';

export interface ComparatorCtx {
  mode: ComparatorMode;
  back: number; // 0..15
  sideMax: number; // 0..15
}

export function output(c: ComparatorCtx): number {
  const back = clamp(c.back);
  const side = clamp(c.sideMax);
  if (c.mode === 'compare') return side <= back ? back : 0;
  return Math.max(0, back - side);
}

function clamp(n: number): number {
  return Math.max(0, Math.min(15, n));
}

export function toggleMode(m: ComparatorMode): ComparatorMode {
  return m === 'compare' ? 'subtract' : 'compare';
}

// Container fullness reading: floor(14 * items / maxItems) + (items > 0 ? 1 : 0)
export function containerSignal(items: number, max: number): number {
  if (items <= 0) return 0;
  return Math.floor((14 * items) / max) + 1;
}
