import { describe, it, expect } from 'vitest';
import {
  MAP_DIM,
  makeFilledMap,
  markerPixelOf,
  paintPixel,
  pixelsPerBlock,
  readPixel,
  worldToMapPixel,
} from './map_item';

describe('filled map', () => {
  it('has 128x128 pixels', () => {
    const m = makeFilledMap(1, 0, 0, 0, 'overworld');
    expect(m.pixels.length).toBe(MAP_DIM * MAP_DIM);
  });

  it('scale 0 = 1 block per pixel', () => {
    expect(pixelsPerBlock(0)).toBe(1);
  });

  it('scale 3 = 8 blocks per pixel', () => {
    expect(pixelsPerBlock(3)).toBe(8);
  });

  it('center block maps to center pixel', () => {
    const m = makeFilledMap(1, 0, 0, 0, 'overworld');
    const p = worldToMapPixel(m, 0, 0);
    expect(p).toEqual({ px: 64, pz: 64 });
  });

  it('out of range pixel returns null', () => {
    const m = makeFilledMap(1, 0, 0, 0, 'overworld');
    expect(worldToMapPixel(m, 1000, 0)).toBeNull();
  });

  it('paint + read round-trips', () => {
    const m = makeFilledMap(1, 0, 0, 0, 'overworld');
    paintPixel(m, 5, 5, 42);
    expect(readPixel(m, 5, 5)).toBe(42);
  });

  it('paint out of range is a no-op', () => {
    const m = makeFilledMap(1, 0, 0, 0, 'overworld');
    paintPixel(m, -1, -1, 42);
    paintPixel(m, 1000, 1000, 42);
    expect(m.pixels.every((b) => b === 0)).toBe(true);
  });

  it('marker projects to map pixel', () => {
    const m = makeFilledMap(1, 100, 100, 1, 'overworld');
    const p = markerPixelOf(m, {
      kind: 'player',
      worldX: 104,
      worldZ: 100,
      yawRad: 0,
      color: 1,
    });
    expect(p?.px).toBe(66);
  });
});
