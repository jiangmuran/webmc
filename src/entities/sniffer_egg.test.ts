import { describe, it, expect } from 'vitest';
import { makeSnifferEgg, tickSnifferEgg } from './sniffer_egg';

describe('sniffer egg', () => {
  it('hatches after 20 min on plain ground', () => {
    const e = makeSnifferEgg(false);
    const r = tickSnifferEgg(e, 20 * 60);
    expect(r.hatched).toBe(true);
  });

  it('hatches twice as fast on moss', () => {
    const e = makeSnifferEgg(true);
    const r = tickSnifferEgg(e, 10 * 60);
    expect(r.hatched).toBe(true);
  });

  it('cracks progress 0 → 1 → 2', () => {
    const e = makeSnifferEgg(false);
    const first = tickSnifferEgg(e, 100);
    expect(first.cracks).toBe(0);
    const mid = tickSnifferEgg(e, 400); // total 500s ≈ 42% → 1 crack
    expect(mid.cracks).toBe(1);
    const late = tickSnifferEgg(e, 400); // total 900s ≈ 75% → 2 cracks
    expect(late.cracks).toBe(2);
  });
});
