// Packet ACK window. Reliable-ordered packets track pending ACKs with
// a sliding window. Resend pending packets after RTT * 2 timeout.

export interface PendingPacket {
  seq: number;
  sentAtMs: number;
  data: Uint8Array;
  tries: number;
}

export class AckWindow {
  private pending = new Map<number, PendingPacket>();
  private nextSeq = 0;
  private rttMs = 100;

  send(data: Uint8Array, nowMs: number): PendingPacket {
    const seq = this.nextSeq++;
    const p: PendingPacket = { seq, sentAtMs: nowMs, data, tries: 1 };
    this.pending.set(seq, p);
    return p;
  }

  ack(seq: number, nowMs: number): boolean {
    const p = this.pending.get(seq);
    if (!p) return false;
    const sampleRtt = nowMs - p.sentAtMs;
    this.rttMs = Math.round(this.rttMs * 0.875 + sampleRtt * 0.125);
    this.pending.delete(seq);
    return true;
  }

  timeoutsFor(nowMs: number): PendingPacket[] {
    const limit = this.rttMs * 2 + 50;
    const out: PendingPacket[] = [];
    for (const p of this.pending.values()) {
      if (nowMs - p.sentAtMs > limit) out.push(p);
    }
    return out;
  }

  markResent(seq: number, nowMs: number): void {
    const p = this.pending.get(seq);
    if (!p) return;
    p.sentAtMs = nowMs;
    p.tries += 1;
  }

  get smoothedRttMs(): number {
    return this.rttMs;
  }

  get pendingCount(): number {
    return this.pending.size;
  }
}
