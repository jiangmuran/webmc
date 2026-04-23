import { describe, it, expect } from 'vitest';
import { make, allocateSeq, acceptIncoming } from './packet_sequencer';

describe('packet sequencer', () => {
  it('allocates monotonic seq', () => {
    const s0 = make();
    const r = allocateSeq(s0);
    expect(r.seq).toBe(0);
    expect(allocateSeq(r.state).seq).toBe(1);
  });

  it('in-order releases immediately', () => {
    let s = make();
    const a = acceptIncoming(s, 0, 'A');
    expect(a.release).toEqual(['A']);
    s = a.state;
    const b = acceptIncoming(s, 1, 'B');
    expect(b.release).toEqual(['B']);
  });

  it('out-of-order buffers', () => {
    let s = make();
    s = acceptIncoming(s, 2, 'C').state;
    s = acceptIncoming(s, 1, 'B').state;
    const a = acceptIncoming(s, 0, 'A');
    expect(a.release).toEqual(['A', 'B', 'C']);
  });

  it('duplicate dropped', () => {
    let s = make();
    s = acceptIncoming(s, 0, 'A').state;
    const dup = acceptIncoming(s, 0, 'A');
    expect(dup.release).toEqual([]);
  });
});
