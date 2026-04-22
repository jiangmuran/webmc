// Chunk mesh worker coordination. Submit a chunk for meshing; the
// worker returns a transferable ArrayBuffer. Coalesces a burst of
// requests into one batch to reduce message count.

export interface MeshRequest {
  cx: number;
  cz: number;
  paletteId: number;
  priority: number;
}

export class MeshRequestBatcher {
  private pending = new Map<string, MeshRequest>();
  private batchSize: number;

  constructor(batchSize = 32) {
    this.batchSize = batchSize;
  }

  submit(req: MeshRequest): void {
    const key = `${req.cx},${req.cz}`;
    const existing = this.pending.get(key);
    if (!existing || existing.priority < req.priority) {
      this.pending.set(key, req);
    }
  }

  drain(): MeshRequest[] {
    if (this.pending.size === 0) return [];
    const all = [...this.pending.values()].sort((a, b) => b.priority - a.priority);
    const out = all.slice(0, this.batchSize);
    for (const r of out) this.pending.delete(`${r.cx},${r.cz}`);
    return out;
  }

  get size(): number {
    return this.pending.size;
  }

  cancel(cx: number, cz: number): boolean {
    return this.pending.delete(`${cx},${cz}`);
  }
}
