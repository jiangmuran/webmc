import { describe, it, expect } from 'vitest';
import { tickEgg, isReady, HATCH_TICKS_NORMAL, HATCH_TICKS_MOSS } from './sniffer_egg_hatch';

describe('sniffer egg hatch', () => {
  it('moss halves the time', () => {
    expect(HATCH_TICKS_MOSS * 2).toBe(HATCH_TICKS_NORMAL);
  });

  it('cracks progress', () => {
    const one = tickEgg({ onMoss: false, tickAge: HATCH_TICKS_NORMAL / 3, cracks: 0 });
    expect(one.cracks).toBe(1);
    const two = tickEgg({ onMoss: false, tickAge: (HATCH_TICKS_NORMAL * 2) / 3, cracks: 1 });
    expect(two.cracks).toBe(2);
  });

  it('ready at limit on moss', () => {
    expect(isReady({ onMoss: true, tickAge: HATCH_TICKS_MOSS, cracks: 2 })).toBe(true);
  });

  it('not ready early', () => {
    expect(isReady({ onMoss: false, tickAge: 100, cracks: 0 })).toBe(false);
  });
});
