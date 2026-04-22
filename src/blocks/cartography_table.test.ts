import { describe, it, expect } from 'vitest';
import {
  duplicateMap,
  makeMap,
  markBanner,
  scaleBlockRadius,
  toggleLocator,
  zoomOut,
} from './cartography_table';

describe('cartography table', () => {
  it('fresh map is 1:1 (scale 0, radius 64)', () => {
    const m = makeMap();
    expect(m.scale).toBe(0);
    expect(scaleBlockRadius(m)).toBe(64);
  });

  it('zoomOut caps at 4 (radius 1024)', () => {
    const m = makeMap();
    for (let i = 0; i < 10; i++) zoomOut(m);
    expect(m.scale).toBe(4);
    expect(scaleBlockRadius(m)).toBe(1024);
  });

  it('duplicate yields identical but independent map', () => {
    const a = makeMap(100, -50);
    const b = duplicateMap(a);
    b.centerX = 999;
    expect(a.centerX).toBe(100);
  });

  it('toggleLocator flips flag', () => {
    const m = makeMap();
    toggleLocator(m);
    expect(m.markedLocator).toBe(true);
    toggleLocator(m);
    expect(m.markedLocator).toBe(false);
  });

  it('markBanner adds an entry', () => {
    const m = makeMap();
    markBanner(m, { x: 10, z: 10, color: 'red' });
    expect(m.bannerMarks.length).toBe(1);
  });
});
