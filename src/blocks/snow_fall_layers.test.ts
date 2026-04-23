import { describe, it, expect } from 'vitest';
import { addLayer, heightBlocks, placesFullBlockAt, MAX_LAYERS } from './snow_fall_layers';

describe('snow fall layers', () => {
  it('accumulates at top in snow biome', () => {
    const c = addLayer({ biomeSnowing: true, topOfChunk: true, layers: 0 });
    expect(c.layers).toBe(1);
  });

  it('no stack below top', () => {
    expect(addLayer({ biomeSnowing: true, topOfChunk: false, layers: 3 }).layers).toBe(3);
  });

  it('caps at max', () => {
    expect(addLayer({ biomeSnowing: true, topOfChunk: true, layers: MAX_LAYERS }).layers).toBe(
      MAX_LAYERS,
    );
  });

  it('full height at max', () => {
    expect(heightBlocks({ biomeSnowing: false, topOfChunk: false, layers: MAX_LAYERS })).toBe(1);
    expect(placesFullBlockAt({ biomeSnowing: false, topOfChunk: false, layers: MAX_LAYERS })).toBe(
      true,
    );
  });
});
