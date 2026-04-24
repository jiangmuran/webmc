export interface OrderedBuffer<T> {
  expectedSeq: number;
  pending: Map<number, T>;
}

export function createBuffer<T>(startSeq = 0): OrderedBuffer<T> {
  return { expectedSeq: startSeq, pending: new Map() };
}

export function onReceive<T>(b: OrderedBuffer<T>, seq: number, payload: T): readonly T[] {
  if (seq < b.expectedSeq) return [];
  b.pending.set(seq, payload);
  const ready: T[] = [];
  while (b.pending.has(b.expectedSeq)) {
    const next = b.pending.get(b.expectedSeq);
    if (next !== undefined) ready.push(next);
    b.pending.delete(b.expectedSeq);
    b.expectedSeq++;
  }
  return ready;
}

export function queuedCount<T>(b: OrderedBuffer<T>): number {
  return b.pending.size;
}
