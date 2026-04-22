import { describe, it, expect } from 'vitest';
import { Weather } from './weather';

function seededRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('Weather', () => {
  it('starts clear', () => {
    const w = new Weather(seededRng(1));
    expect(w.current).toBe('clear');
  });

  it('transitions clear → rain after clear duration', () => {
    const w = new Weather(seededRng(1), { clearMinSec: 1, clearMaxSec: 1 });
    expect(w.tick(0.5)).toBeNull();
    const next = w.tick(0.6);
    expect(next).toBe('rain');
    expect(w.current).toBe('rain');
  });

  it('rain eventually returns to clear', () => {
    const w = new Weather(seededRng(2), {
      clearMinSec: 0.1,
      clearMaxSec: 0.1,
      rainMinSec: 0.1,
      rainMaxSec: 0.1,
      thunderChance: 0,
    });
    const seen = new Set<string>();
    for (let i = 0; i < 100; i++) {
      const k = w.tick(0.1);
      if (k !== null) seen.add(k);
    }
    expect(seen.has('clear')).toBe(true);
    expect(seen.has('rain')).toBe(true);
  });

  it('thunder fires occasionally with nonzero thunderChance', () => {
    const w = new Weather(seededRng(7), {
      clearMinSec: 0.01,
      clearMaxSec: 0.01,
      rainMinSec: 0.01,
      rainMaxSec: 0.01,
      thunderMinSec: 0.01,
      thunderMaxSec: 0.01,
      thunderChance: 1,
    });
    let sawThunder = false;
    for (let i = 0; i < 200; i++) {
      if (w.tick(0.01) === 'thunder') sawThunder = true;
    }
    expect(sawThunder).toBe(true);
  });

  it('force sets the kind immediately', () => {
    const w = new Weather(seededRng(3));
    w.force('thunder', 60);
    expect(w.current).toBe('thunder');
    expect(w.timeLeftSec).toBe(60);
  });
});
