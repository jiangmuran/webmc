import { describe, it, expect } from 'vitest';
import { makeNarrator, announce, next, setEnabled } from './accessibility_narrator';

describe('accessibility narrator', () => {
  it('disabled drops messages', () => {
    const n = makeNarrator();
    announce(n, 'hello', 'low', 'a');
    expect(next(n)).toBeNull();
  });

  it('announces when enabled', () => {
    const n = makeNarrator();
    setEnabled(n, true);
    announce(n, 'hello', 'low', 'a');
    expect(next(n)?.text).toBe('hello');
  });

  it('priority orders', () => {
    const n = makeNarrator();
    setEnabled(n, true);
    announce(n, 'low', 'low', 'a');
    announce(n, 'high', 'high', 'b');
    expect(next(n)?.text).toBe('high');
  });

  it('dedup by id', () => {
    const n = makeNarrator();
    setEnabled(n, true);
    announce(n, 'first', 'low', 'same');
    announce(n, 'second', 'low', 'same');
    expect(n.queue.length).toBe(1);
    expect(next(n)?.text).toBe('second');
  });

  it('disable clears queue', () => {
    const n = makeNarrator();
    setEnabled(n, true);
    announce(n, 'x', 'low', 'a');
    setEnabled(n, false);
    expect(n.queue.length).toBe(0);
  });
});
