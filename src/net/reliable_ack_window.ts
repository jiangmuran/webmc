// Sliding-window acknowledgement for reliable channel. Sender keeps
// unacked packets until ACK arrives; retransmits after timeout.

export interface UnackedPacket {
  seq: number;
  payload: unknown;
  sentAtMs: number;
  attempts: number;
}

export interface ReliableSender {
  unacked: Map<number, UnackedPacket>;
  nextSeq: number;
  rtoMs: number;
  maxAttempts: number;
}

export function makeSender(rtoMs = 250, maxAttempts = 5): ReliableSender {
  return { unacked: new Map(), nextSeq: 0, rtoMs, maxAttempts };
}

export function send(s: ReliableSender, payload: unknown, nowMs: number): UnackedPacket {
  const p: UnackedPacket = { seq: s.nextSeq++, payload, sentAtMs: nowMs, attempts: 1 };
  s.unacked.set(p.seq, p);
  return p;
}

export function ack(s: ReliableSender, seq: number): boolean {
  return s.unacked.delete(seq);
}

export function dueForRetransmit(s: ReliableSender, nowMs: number): UnackedPacket[] {
  const out: UnackedPacket[] = [];
  for (const p of s.unacked.values()) {
    if (nowMs - p.sentAtMs >= s.rtoMs) out.push(p);
  }
  return out;
}

export function retransmit(s: ReliableSender, seq: number, nowMs: number): UnackedPacket | null {
  const p = s.unacked.get(seq);
  if (!p) return null;
  if (p.attempts >= s.maxAttempts) {
    s.unacked.delete(seq);
    return null;
  }
  p.sentAtMs = nowMs;
  p.attempts++;
  return p;
}
