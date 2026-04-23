import { describe, it, expect } from 'vitest';
import {
  makeQueue,
  enqueue,
  prune,
  opacityFor,
  MAX_SUBTITLES,
  SUBTITLE_LIFETIME_MS,
} from './subtitle_queue';

describe('subtitle queue', () => {
  it('enqueue adds entry', () => {
    const q = makeQueue();
    enqueue(q, 'Creeper hissing', 'left', 0);
    expect(q.entries.length).toBe(1);
  });

  it('caps at max', () => {
    const q = makeQueue();
    for (let i = 0; i < MAX_SUBTITLES + 3; i++) enqueue(q, `t${i}`, 'center', 0);
    expect(q.entries.length).toBe(MAX_SUBTITLES);
  });

  it('prune drops expired', () => {
    const q = makeQueue();
    enqueue(q, 'old', 'center', 0);
    prune(q, SUBTITLE_LIFETIME_MS + 1);
    expect(q.entries.length).toBe(0);
  });

  it('opacity full when young', () => {
    const q = makeQueue();
    enqueue(q, 'x', 'center', 0);
    const e = q.entries[0];
    if (!e) throw new Error('empty');
    expect(opacityFor(e, 100)).toBe(1);
  });

  it('opacity fades near expiry', () => {
    const q = makeQueue();
    enqueue(q, 'x', 'center', 0);
    const e = q.entries[0];
    if (!e) throw new Error('empty');
    expect(opacityFor(e, SUBTITLE_LIFETIME_MS - 100)).toBeLessThan(0.2);
  });
});
