import { describe, it, expect } from 'vitest';
import {
  makeMap,
  worldToTile,
  isExplored,
  markExplored,
  zoomOut,
  scaleTileBlocks,
  MAP_SIZE,
} from './map_tracking';

describe('map tracking', () => {
  it('scale tile width', () => {
    expect(scaleTileBlocks(0)).toBe(1);
    expect(scaleTileBlocks(4)).toBe(16);
  });

  it('center maps to middle', () => {
    const m = makeMap(0, 0, 0);
    const t = worldToTile(m, 0, 0);
    expect(t).toEqual({ tx: MAP_SIZE / 2, tz: MAP_SIZE / 2 });
  });

  it('out of range = null', () => {
    const m = makeMap(0, 0, 0);
    expect(worldToTile(m, 10_000, 0)).toBeNull();
  });

  it('mark and read', () => {
    const m = makeMap(0, 0, 0);
    markExplored(m, 10, 20);
    expect(isExplored(m, 10, 20)).toBe(true);
    expect(isExplored(m, 11, 20)).toBe(false);
  });

  it('zoom out resets exploration', () => {
    const m = makeMap(0, 0, 0);
    markExplored(m, 0, 0);
    expect(zoomOut(m)).toBe(true);
    expect(m.scale).toBe(1);
    expect(isExplored(m, 0, 0)).toBe(false);
  });

  it('max scale blocked', () => {
    const m = makeMap(0, 0, 4);
    expect(zoomOut(m)).toBe(false);
  });
});
