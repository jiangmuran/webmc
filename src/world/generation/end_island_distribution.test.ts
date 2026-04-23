import { describe, it, expect } from 'vitest';
import {
  shouldPlaceIsland,
  mainIslandPlatformFlat,
  OUTER_ISLAND_MIN_DISTANCE,
} from './end_island_distribution';

describe('end island distribution', () => {
  it('inner void no island', () => {
    expect(shouldPlaceIsland({ cx: 5, cz: 5, noise: 1 })).toBe(false);
  });

  it('outer with high noise places', () => {
    expect(
      shouldPlaceIsland({
        cx: Math.ceil(OUTER_ISLAND_MIN_DISTANCE / 16 + 10),
        cz: 0,
        noise: 0.9,
      }),
    ).toBe(true);
  });

  it('outer low noise no', () => {
    expect(
      shouldPlaceIsland({
        cx: Math.ceil(OUTER_ISLAND_MIN_DISTANCE / 16 + 10),
        cz: 0,
        noise: 0.1,
      }),
    ).toBe(false);
  });

  it('main platform detection', () => {
    expect(mainIslandPlatformFlat(0, 0)).toBe(true);
    expect(mainIslandPlatformFlat(100, 0)).toBe(false);
  });
});
