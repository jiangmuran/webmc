export function bitsPerIndex(paletteSize: number): number {
  if (paletteSize <= 1) return 0;
  let b = 1;
  while (1 << b < paletteSize) b++;
  return Math.max(4, b);
}

export function packedBytes(voxelCount: number, bits: number): number {
  return Math.ceil((voxelCount * bits) / 8);
}

export function singleValueOptimization(paletteSize: number): boolean {
  return paletteSize === 1;
}
