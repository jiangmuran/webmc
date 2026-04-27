export type BitsPerIndex = 0 | 4 | 8 | 16;

export function bitsNeeded(paletteSize: number): BitsPerIndex {
  if (paletteSize <= 1) return 0;
  if (paletteSize <= 16) return 4;
  if (paletteSize <= 256) return 8;
  return 16;
}

export function wordsNeeded(count: number, bits: BitsPerIndex): number {
  if (bits === 0) return 0;
  return Math.ceil((count * bits) / 32);
}

export function allocIndices(count: number, bits: BitsPerIndex): Uint32Array | null {
  const w = wordsNeeded(count, bits);
  return w === 0 ? null : new Uint32Array(w);
}

export function readIndex(arr: Uint32Array | null, at: number, bits: BitsPerIndex): number {
  if (bits === 0 || arr === null) return 0;
  const bitPos = at * bits;
  const wordIdx = bitPos >>> 5;
  const bitOff = bitPos & 31;
  // Uint32Array read with valid index always returns a number; `!`
  // skips the per-call nullish-coalesce (TS narrowing artifact).
  // readIndex/writeIndex run per cell × 4096 cells × per chunk-set.
  const word = arr[wordIdx]!;
  const mask = (1 << bits) - 1;
  return (word >>> bitOff) & mask;
}

export function writeIndex(arr: Uint32Array, at: number, bits: BitsPerIndex, value: number): void {
  if (bits === 0) return;
  const bitPos = at * bits;
  const wordIdx = bitPos >>> 5;
  const bitOff = bitPos & 31;
  const mask = (1 << bits) - 1;
  const v = value & mask;
  arr[wordIdx] = (arr[wordIdx]! & ~(mask << bitOff)) | (v << bitOff);
}

export function repack(
  src: Uint32Array | null,
  count: number,
  fromBits: BitsPerIndex,
  toBits: BitsPerIndex,
): Uint32Array | null {
  if (toBits === 0) return null;
  const dst = new Uint32Array(wordsNeeded(count, toBits));
  if (fromBits === 0) return dst;
  for (let i = 0; i < count; i++) {
    const v = readIndex(src, i, fromBits);
    writeIndex(dst, i, toBits, v);
  }
  return dst;
}
