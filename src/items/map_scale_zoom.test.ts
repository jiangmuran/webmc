import { describe, it, expect } from 'vitest';
import { zoomOut, blocksPerPixel, coveredBlocks, pixelFor, MAX_SCALE } from './map_scale_zoom';

describe('map scale zoom', () => {
  it('zoom out until cap', () => {
    expect(zoomOut(0)).toBe(1);
    expect(zoomOut(MAX_SCALE)).toBe(MAX_SCALE);
  });

  it('1 bpp at scale 0', () => {
    expect(blocksPerPixel(0)).toBe(1);
  });

  it('16 bpp at scale 4', () => {
    expect(blocksPerPixel(4)).toBe(16);
  });

  it('covers 128 blocks at scale 0', () => {
    expect(coveredBlocks(0)).toBe(128);
  });

  it('center pixel is 64', () => {
    expect(pixelFor(0, 0, 0)).toBe(64);
  });

  it('offset shifts pixel', () => {
    expect(pixelFor(10, 0, 0)).toBe(74);
  });
});
