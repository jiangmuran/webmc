import { describe, it, expect } from 'vitest';
import { shouldPlaceStructure, pickY, MIN_Y, MAX_Y } from './trial_chamber';

describe('trial chamber generation', () => {
  it('deterministic for same seed', () => {
    const a = shouldPlaceStructure({ chunkX: 2, chunkZ: 2, seed: 123 });
    const b = shouldPlaceStructure({ chunkX: 2, chunkZ: 2, seed: 123 });
    expect(a).toBe(b);
  });

  it('some chunks host, some do not', () => {
    let host = 0;
    for (let x = 0; x < 100; x++) {
      for (let z = 0; z < 100; z++) {
        if (shouldPlaceStructure({ chunkX: x, chunkZ: z, seed: 42 })) host++;
      }
    }
    expect(host).toBeGreaterThan(0);
    expect(host).toBeLessThan(10000);
  });

  it('y in deepslate band', () => {
    for (let cx = 0; cx < 20; cx++) {
      const y = pickY(42, cx, cx);
      expect(y).toBeGreaterThanOrEqual(MIN_Y);
      expect(y).toBeLessThanOrEqual(MAX_Y);
    }
  });
});
