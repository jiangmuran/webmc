import { describe, it, expect } from 'vitest';
import { planSpiral, pickBatch, INITIAL_BURST, PER_FRAME } from './chunk_stream_priority';

describe('chunk stream priority', () => {
  it('center first', () => {
    const p = planSpiral(0, 0, 3);
    expect(p[0]).toEqual({ cx: 0, cz: 0, distance: 0 });
  });

  it('within radius only', () => {
    const p = planSpiral(0, 0, 2);
    for (const e of p) expect(e.distance).toBeLessThanOrEqual(4);
  });

  it('initial burst first', () => {
    const all = planSpiral(0, 0, 10);
    const b = pickBatch(all, false);
    expect(b.send.length).toBe(Math.min(INITIAL_BURST, all.length));
  });

  it('subsequent per-frame', () => {
    const all = planSpiral(0, 0, 5);
    const b = pickBatch(all, true);
    expect(b.send.length).toBe(PER_FRAME);
  });

  it('remaining gets leftover', () => {
    const all = planSpiral(0, 0, 3);
    const b = pickBatch(all, false);
    expect(b.remaining.length).toBe(Math.max(0, all.length - INITIAL_BURST));
  });
});
