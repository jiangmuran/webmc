// Outgoing chunk stream queue. When a player moves, new chunks need to
// be sent; the queue prioritizes them by (1) whether the player is
// currently inside them, (2) distance from player, (3) age of request.
// Bounded per-peer bandwidth forces a cap on how many we send per tick.

export interface ChunkRequest {
  dim: string;
  cx: number;
  cz: number;
  playerCx: number;
  playerCz: number;
  requestedAtTick: number;
}

export interface QueuedChunk extends ChunkRequest {
  priority: number; // lower = earlier
}

export class ChunkSendQueue {
  private readonly queue: QueuedChunk[] = [];
  private readonly maxPerTick: number;

  constructor(maxPerTick = 8) {
    this.maxPerTick = maxPerTick;
  }

  enqueue(req: ChunkRequest): void {
    const dx = req.cx - req.playerCx;
    const dz = req.cz - req.playerCz;
    const dist = Math.hypot(dx, dz);
    // Player's current chunk = priority 0; otherwise priority = dist × 100 - age.
    const priority = dist === 0 ? 0 : dist * 100 - req.requestedAtTick * 0.01;
    const entry: QueuedChunk = { ...req, priority };
    this.queue.push(entry);
    this.queue.sort((a, b) => a.priority - b.priority);
  }

  dequeueBatch(): QueuedChunk[] {
    return this.queue.splice(0, this.maxPerTick);
  }

  get size(): number {
    return this.queue.length;
  }

  clearForPlayerMove(newPlayerCx: number, newPlayerCz: number): void {
    for (const q of this.queue) {
      q.playerCx = newPlayerCx;
      q.playerCz = newPlayerCz;
      const dx = q.cx - newPlayerCx;
      const dz = q.cz - newPlayerCz;
      const dist = Math.hypot(dx, dz);
      q.priority = dist === 0 ? 0 : dist * 100 - q.requestedAtTick * 0.01;
    }
    this.queue.sort((a, b) => a.priority - b.priority);
  }

  // Drop chunks outside the new view distance.
  prune(newPlayerCx: number, newPlayerCz: number, viewDistance: number): number {
    let removed = 0;
    for (let i = this.queue.length - 1; i >= 0; i--) {
      const q = this.queue[i];
      if (!q) continue;
      const dx = q.cx - newPlayerCx;
      const dz = q.cz - newPlayerCz;
      if (Math.max(Math.abs(dx), Math.abs(dz)) > viewDistance) {
        this.queue.splice(i, 1);
        removed++;
      }
    }
    return removed;
  }
}
