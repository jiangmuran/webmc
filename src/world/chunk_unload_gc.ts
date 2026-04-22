// Chunk unload garbage collector. Chunks out of all players' view
// distance + a small grace period are eligible for unload. Dirty
// chunks must be written before unload.

export interface ChunkMeta {
  cx: number;
  cz: number;
  lastAccessMs: number;
  dirty: boolean;
  refCount: number; // non-player tickets
}

export interface PlayerView {
  cx: number;
  cz: number;
  viewRadius: number;
}

export interface GcQuery {
  chunks: ChunkMeta[];
  players: PlayerView[];
  nowMs: number;
  graceMs: number; // unload only if untouched for at least this long
}

export interface GcResult {
  toSave: ChunkMeta[];
  toUnload: ChunkMeta[];
}

export function gcChunks(q: GcQuery): GcResult {
  const toSave: ChunkMeta[] = [];
  const toUnload: ChunkMeta[] = [];
  for (const c of q.chunks) {
    if (c.refCount > 0) continue;
    const inAnyView = q.players.some((p) => {
      return Math.abs(p.cx - c.cx) <= p.viewRadius && Math.abs(p.cz - c.cz) <= p.viewRadius;
    });
    if (inAnyView) continue;
    if (q.nowMs - c.lastAccessMs < q.graceMs) continue;
    if (c.dirty) toSave.push(c);
    toUnload.push(c);
  }
  return { toSave, toUnload };
}
