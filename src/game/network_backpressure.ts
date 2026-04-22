// Network backpressure. Limit outbound packets when queue is deep.
// Priority queue drops low-priority first.

export interface OutPacket {
  priority: number; // higher = more important
  size: number;
  sentAtMs?: number;
}

export class SendQueue {
  private buffer: OutPacket[] = [];
  private totalBytes = 0;
  readonly capacityBytes: number;

  constructor(capacityBytes = 1 << 16) {
    this.capacityBytes = capacityBytes;
  }

  enqueue(p: OutPacket): boolean {
    if (this.totalBytes + p.size <= this.capacityBytes) {
      this.buffer.push(p);
      this.totalBytes += p.size;
      return true;
    }
    // try to drop a lower-priority packet
    const worst = this.buffer.reduce(
      (acc, cur, idx) => (cur.priority < acc.p ? { p: cur.priority, idx, size: cur.size } : acc),
      { p: Infinity, idx: -1, size: 0 },
    );
    if (worst.idx >= 0 && worst.p < p.priority) {
      this.totalBytes -= worst.size;
      this.buffer.splice(worst.idx, 1);
      this.buffer.push(p);
      this.totalBytes += p.size;
      return true;
    }
    return false;
  }

  dequeueBatch(maxBytes: number, nowMs: number): OutPacket[] {
    const out: OutPacket[] = [];
    this.buffer.sort((a, b) => b.priority - a.priority);
    let bytes = 0;
    while (this.buffer.length > 0 && bytes + (this.buffer[0]?.size ?? 0) <= maxBytes) {
      const p = this.buffer.shift();
      if (!p) break;
      p.sentAtMs = nowMs;
      bytes += p.size;
      this.totalBytes -= p.size;
      out.push(p);
    }
    return out;
  }

  get size(): number {
    return this.buffer.length;
  }

  get bytes(): number {
    return this.totalBytes;
  }
}
