// Chunk diff patches. Instead of sending full 16³ chunk state,
// send only changed sub-chunks (by hash) and block edits (by index).

export interface BlockEdit {
  index: number;
  paletteId: number;
}

export interface ChunkPatch {
  subChunkIdx: number;
  priorHash: string;
  edits: BlockEdit[];
}

export function applyPatch(
  subChunkBlocks: number[],
  patch: ChunkPatch,
  currentHash: string,
): boolean {
  if (currentHash !== patch.priorHash) return false;
  for (const e of patch.edits) subChunkBlocks[e.index] = e.paletteId;
  return true;
}

export function patchSize(p: ChunkPatch): number {
  // header + per-edit 2 bytes (u16 index + varint palette); coarse.
  return 40 + p.edits.length * 4;
}

export function patchFullyRebuild(subChunkBlocks: number[]): ChunkPatch {
  const edits: BlockEdit[] = subChunkBlocks.map((v, i) => ({ index: i, paletteId: v }));
  return { subChunkIdx: 0, priorHash: '*', edits };
}
