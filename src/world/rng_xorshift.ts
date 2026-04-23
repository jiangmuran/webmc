// Deterministic RNG: xorshift128+ (fast, non-crypto). Used for worldgen
// where a seed must reproduce the same chunks.

export interface RNGState {
  s0: number;
  s1: number;
}

export function makeRNG(seed: number | string): RNGState {
  const h = typeof seed === 'number' ? seed : hashString(seed);
  let a = h || 1;
  a = (a ^ 0x12345678) >>> 0;
  return { s0: a, s1: (a * 2654435761) >>> 0 };
}

export function next01(r: RNGState): number {
  let s1 = r.s0 >>> 0;
  const s0 = r.s1 >>> 0;
  r.s0 = s0;
  s1 ^= (s1 << 23) >>> 0;
  s1 = (s1 ^ (s1 >>> 17)) >>> 0;
  s1 = (s1 ^ s0) >>> 0;
  s1 = (s1 ^ (s0 >>> 26)) >>> 0;
  r.s1 = s1;
  return ((s1 + s0) >>> 0) / 0x100000000;
}

export function nextInt(r: RNGState, max: number): number {
  return Math.floor(next01(r) * max);
}

export function nextRange(r: RNGState, min: number, max: number): number {
  return min + next01(r) * (max - min);
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return h >>> 0;
}
