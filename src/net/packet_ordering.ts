// Reliable packet ordering. Each reliable channel is keyed by
// sequence numbers; receiver buffers out-of-order packets until
// the gap fills.

export interface OrderedReceiver {
  expected: number;
  buffer: Map<number, unknown>;
}

export function makeReceiver(): OrderedReceiver {
  return { expected: 0, buffer: new Map() };
}

export function onReceive(r: OrderedReceiver, seq: number, payload: unknown): unknown[] {
  if (seq < r.expected) return []; // duplicate / old
  r.buffer.set(seq, payload);
  const delivered: unknown[] = [];
  while (r.buffer.has(r.expected)) {
    delivered.push(r.buffer.get(r.expected));
    r.buffer.delete(r.expected);
    r.expected++;
  }
  return delivered;
}

export function pendingCount(r: OrderedReceiver): number {
  return r.buffer.size;
}
