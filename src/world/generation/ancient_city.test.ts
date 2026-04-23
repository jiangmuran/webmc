import { describe, it, expect } from 'vitest';
import { canGenerate, wardenSpawningEnabled, Y_LEVEL } from './ancient_city';

describe('ancient city gen', () => {
  it('only deep_dark', () => {
    expect(canGenerate({ chunkX: 0, chunkZ: 0, seed: 1, biome: 'plains' })).toBe(false);
  });

  it('some hit in deep_dark', () => {
    let hits = 0;
    for (let x = 0; x < 50; x++) {
      for (let z = 0; z < 50; z++) {
        if (canGenerate({ chunkX: x, chunkZ: z, seed: 7, biome: 'deep_dark' })) hits++;
      }
    }
    expect(hits).toBeGreaterThan(0);
  });

  it('warden spawns', () => {
    expect(wardenSpawningEnabled()).toBe(true);
  });

  it('Y in deepslate', () => {
    expect(Y_LEVEL).toBeLessThan(0);
  });
});
