import { describe, it, expect } from 'vitest';
import { cherryPetalRate, shouldPlaceTorchflower, leafColor } from './cherry_grove_flora';

describe('cherry grove flora', () => {
  it('petals only in cherry', () => {
    expect(cherryPetalRate({ isCherryBiome: true, rng: () => 0 })).toBeGreaterThan(0);
    expect(cherryPetalRate({ isCherryBiome: false, rng: () => 0 })).toBe(0);
  });

  it('torchflower chance', () => {
    expect(shouldPlaceTorchflower({ isCherryBiome: true, rng: () => 0 })).toBe(true);
    expect(shouldPlaceTorchflower({ isCherryBiome: true, rng: () => 0.9 })).toBe(false);
  });

  it('pink leaf color', () => {
    const [r, g, b] = leafColor();
    expect(r).toBeGreaterThan(g);
    expect(r).toBeGreaterThan(b);
  });
});
