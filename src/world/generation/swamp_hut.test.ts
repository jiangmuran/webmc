import { describe, it, expect } from 'vitest';
import { canGenerate, containsMobs } from './swamp_hut';

describe('swamp hut', () => {
  it('only in swamp', () => {
    expect(canGenerate({ chunkX: 0, chunkZ: 0, seed: 1, biome: 'plains' })).toBe(false);
  });

  it('rare in swamp', () => {
    let hits = 0;
    for (let i = 0; i < 1000; i++) {
      if (canGenerate({ chunkX: i, chunkZ: i * 7, seed: 42, biome: 'swamp' })) hits++;
    }
    expect(hits).toBeGreaterThan(0);
    expect(hits).toBeLessThan(200);
  });

  it('contains witch + cat', () => {
    const m = containsMobs();
    expect(m.witch).toBe(true);
    expect(m.cat).toBe(true);
  });
});
