export const MAX_SIGNAL = 15;

export function propagateFrom(source: number, distance: number): number {
  return Math.max(0, source - distance);
}

export function maxDistance(): number {
  return MAX_SIGNAL;
}

export function strongerOf(a: number, b: number): number {
  return Math.max(a, b);
}
