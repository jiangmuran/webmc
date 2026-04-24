import { describe, it, expect } from 'vitest';
import { createBuffer, onReceive, queuedCount } from './ordering_sequence_gaps';

describe('ordering sequence gaps', () => {
  it('in order delivered immediately', () => {
    const b = createBuffer<string>();
    expect(onReceive(b, 0, 'a')).toEqual(['a']);
  });

  it('out of order buffered', () => {
    const b = createBuffer<string>();
    expect(onReceive(b, 2, 'c')).toEqual([]);
    expect(queuedCount(b)).toBe(1);
  });

  it('gap fills in order', () => {
    const b = createBuffer<string>();
    onReceive(b, 2, 'c');
    onReceive(b, 1, 'b');
    const out = onReceive(b, 0, 'a');
    expect(out).toEqual(['a', 'b', 'c']);
  });

  it('old seq dropped', () => {
    const b = createBuffer<string>(5);
    expect(onReceive(b, 3, 'old')).toEqual([]);
  });

  it('queued emptied after fill', () => {
    const b = createBuffer<string>();
    onReceive(b, 2, 'c');
    onReceive(b, 1, 'b');
    onReceive(b, 0, 'a');
    expect(queuedCount(b)).toBe(0);
  });
});
