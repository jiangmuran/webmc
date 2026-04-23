export interface SubChunkData {
  palette: readonly string[];
  indices: readonly number[];
}

export function rebuildPalette(data: SubChunkData): SubChunkData {
  const used = new Set<number>();
  for (const i of data.indices) used.add(i);
  const remap = new Map<number, number>();
  const newPalette: string[] = [];
  for (let i = 0; i < data.palette.length; i++) {
    if (used.has(i)) {
      remap.set(i, newPalette.length);
      const entry = data.palette[i];
      if (entry !== undefined) newPalette.push(entry);
    }
  }
  if (newPalette.length === 0) newPalette.push('air');
  const airIndex = newPalette.indexOf('air');
  const newIndices = data.indices.map((i) => remap.get(i) ?? (airIndex >= 0 ? airIndex : 0));
  return { palette: newPalette, indices: newIndices };
}

export function bitsPerIndex(paletteSize: number): number {
  if (paletteSize <= 1) return 0;
  return Math.max(4, Math.ceil(Math.log2(paletteSize)));
}
