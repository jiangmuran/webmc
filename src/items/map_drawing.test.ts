import { describe, it, expect } from 'vitest';
import { blocksPerPixel, mapCoveredArea, worldToMapPixel, isOnMap, MAP_WIDTH } from './map_drawing';

describe('map drawing', () => {
  it('scale 0 = 1 block/pixel', () => {
    expect(blocksPerPixel(0)).toBe(1);
  });

  it('scale 4 = 16 blocks/pixel', () => {
    expect(blocksPerPixel(4)).toBe(16);
  });

  it('coverage grows', () => {
    expect(mapCoveredArea(4)).toBeGreaterThan(mapCoveredArea(0));
  });

  it('world to pixel center', () => {
    const p = worldToMapPixel({ x: 0, z: 0 }, { x: 0, z: 0 }, 0);
    expect(p.u).toBe(MAP_WIDTH / 2);
  });

  it('onMap bounds', () => {
    expect(isOnMap(0, 0)).toBe(true);
    expect(isOnMap(200, 200)).toBe(false);
  });
});
