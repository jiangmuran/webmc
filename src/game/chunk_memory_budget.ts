// Chunk memory budget. Track approximate bytes used per loaded chunk.
// When total exceeds budget, unload lowest-priority chunks.

export interface ChunkMemInfo {
  cx: number;
  cz: number;
  bytes: number;
  priority: number; // higher = keep
}

export class ChunkMemoryTracker {
  private chunks = new Map<string, ChunkMemInfo>();
  private budgetBytes: number;

  constructor(budgetBytes: number) {
    this.budgetBytes = budgetBytes;
  }

  private key(cx: number, cz: number): string {
    return `${cx},${cz}`;
  }

  track(info: ChunkMemInfo): void {
    this.chunks.set(this.key(info.cx, info.cz), info);
  }

  untrack(cx: number, cz: number): void {
    this.chunks.delete(this.key(cx, cz));
  }

  totalBytes(): number {
    let s = 0;
    for (const c of this.chunks.values()) s += c.bytes;
    return s;
  }

  // Returns chunks to evict to drop below budget.
  evictionCandidates(): ChunkMemInfo[] {
    const total = this.totalBytes();
    if (total <= this.budgetBytes) return [];
    const sorted = [...this.chunks.values()].sort((a, b) => a.priority - b.priority);
    const out: ChunkMemInfo[] = [];
    let freed = 0;
    for (const c of sorted) {
      if (total - freed <= this.budgetBytes) break;
      out.push(c);
      freed += c.bytes;
    }
    return out;
  }
}
