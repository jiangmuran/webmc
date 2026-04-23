import { describe, it, expect } from 'vitest';
import { sampleHeight, colorForHeight, isVisiblePixel } from './minimap_render';

describe('minimap render', () => {
  it('sample within bounds', () => {
    const hm = [1, 2, 3, 4];
    expect(
      sampleHeight({ heightmap: hm, w: 2, h: 2, centerX: 1, centerZ: 1, radius: 1 }, 1, 1),
    ).toBe(4);
  });

  it('out of bounds undefined', () => {
    const hm = [1, 2, 3, 4];
    expect(
      sampleHeight({ heightmap: hm, w: 2, h: 2, centerX: 1, centerZ: 1, radius: 1 }, 100, 100),
    ).toBeUndefined();
  });

  it('color gradient monotonic', () => {
    expect(colorForHeight(100, 0, 255)).toBeGreaterThan(colorForHeight(0, 0, 255));
  });

  it('visibility circle', () => {
    expect(isVisiblePixel(32, 32, 32, 10)).toBe(true);
    expect(isVisiblePixel(100, 32, 32, 10)).toBe(false);
  });
});
