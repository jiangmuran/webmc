import { describe, it, expect } from 'vitest';
import { makeReceiver, onReceive, pendingCount } from './packet_ordering';

describe('packet ordering', () => {
  it('delivers in order', () => {
    const r = makeReceiver();
    expect(onReceive(r, 0, 'a')).toEqual(['a']);
    expect(onReceive(r, 1, 'b')).toEqual(['b']);
  });

  it('buffers out of order', () => {
    const r = makeReceiver();
    expect(onReceive(r, 2, 'c')).toEqual([]);
    expect(onReceive(r, 1, 'b')).toEqual([]);
    expect(onReceive(r, 0, 'a')).toEqual(['a', 'b', 'c']);
  });

  it('ignores duplicates', () => {
    const r = makeReceiver();
    onReceive(r, 0, 'a');
    expect(onReceive(r, 0, 'a-dup')).toEqual([]);
  });

  it('pending count', () => {
    const r = makeReceiver();
    onReceive(r, 2, 'c');
    onReceive(r, 3, 'd');
    expect(pendingCount(r)).toBe(2);
  });
});
