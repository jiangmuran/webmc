export interface SequencerState {
  nextSeq: number;
  outOfOrderBuffer: Map<number, unknown>;
  expectedSeq: number;
}

export function make(): SequencerState {
  return { nextSeq: 0, outOfOrderBuffer: new Map(), expectedSeq: 0 };
}

export function allocateSeq(s: SequencerState): { seq: number; state: SequencerState } {
  return { seq: s.nextSeq, state: { ...s, nextSeq: s.nextSeq + 1 } };
}

export function acceptIncoming<T>(
  s: SequencerState,
  seq: number,
  payload: T,
): { release: T[]; state: SequencerState } {
  if (seq < s.expectedSeq) return { release: [], state: s };
  if (seq === s.expectedSeq) {
    const released: T[] = [payload];
    let exp = s.expectedSeq + 1;
    const buf = new Map(s.outOfOrderBuffer);
    while (buf.has(exp)) {
      released.push(buf.get(exp) as T);
      buf.delete(exp);
      exp++;
    }
    return { release: released, state: { ...s, expectedSeq: exp, outOfOrderBuffer: buf } };
  }
  const buf = new Map(s.outOfOrderBuffer);
  buf.set(seq, payload);
  return { release: [], state: { ...s, outOfOrderBuffer: buf } };
}
