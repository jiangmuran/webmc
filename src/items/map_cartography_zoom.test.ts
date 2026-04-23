import { describe, it, expect } from 'vitest';
import { blocksPerPixelAt, areaBlocks, canZoomOut, MAX_ZOOM } from './map_cartography_zoom';

describe('map cartography zoom', () => {
  it('zoom 0 = 1 block per pixel', () => {
    expect(blocksPerPixelAt(0)).toBe(1);
  });

  it('max zoom 16 bpp', () => {
    expect(blocksPerPixelAt(MAX_ZOOM)).toBe(16);
  });

  it('higher zoom larger area', () => {
    expect(areaBlocks(4)).toBeGreaterThan(areaBlocks(0));
  });

  it('zoom out limit', () => {
    expect(canZoomOut(MAX_ZOOM)).toBe(false);
    expect(canZoomOut(0)).toBe(true);
  });
});
