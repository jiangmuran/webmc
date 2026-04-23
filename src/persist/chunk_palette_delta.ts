export interface Palette {
  entries: string[];
}

export function paletteIndex(p: Palette, block: string): number {
  return p.entries.indexOf(block);
}

export function addBlock(p: Palette, block: string): { palette: Palette; idx: number } {
  const existing = paletteIndex(p, block);
  if (existing !== -1) return { palette: p, idx: existing };
  return { palette: { entries: [...p.entries, block] }, idx: p.entries.length };
}

export function removeUnused(p: Palette, usedIndices: Set<number>): Palette {
  return { entries: p.entries.filter((_, i) => usedIndices.has(i)) };
}

export function bitsForPalette(size: number): number {
  if (size <= 1) return 0;
  let b = 1;
  while (1 << b < size) b++;
  return Math.max(4, b);
}
