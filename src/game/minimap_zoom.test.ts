import { describe, it, expect } from 'vitest';
import {
  makeMinimap,
  zoomIn,
  zoomOut,
  chunksVisible,
  blocksVisible,
  inView,
  MAX_ZOOM,
  MIN_ZOOM,
} from './minimap_zoom';

describe('minimap', () => {
  it('default visible 1 chunk', () => {
    const m = makeMinimap();
    expect(chunksVisible(m)).toBe(1);
    expect(blocksVisible(m)).toBe(16);
  });

  it('zoom out grows', () => {
    const m = makeMinimap();
    zoomOut(m);
    zoomOut(m);
    expect(chunksVisible(m)).toBe(4);
  });

  it('clamped', () => {
    const m = { zoomLevel: MAX_ZOOM };
    zoomOut(m);
    expect(m.zoomLevel).toBe(MAX_ZOOM);
    m.zoomLevel = MIN_ZOOM;
    zoomIn(m);
    expect(m.zoomLevel).toBe(MIN_ZOOM);
  });

  it('inView bounds', () => {
    const m = { zoomLevel: 2 }; // 4 chunks = 64 blocks half = 32
    expect(inView(m, 30, 30)).toBe(true);
    expect(inView(m, 40, 0)).toBe(false);
  });
});
