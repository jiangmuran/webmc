import { describe, it, expect } from 'vitest';
import { placesTopSnow, iceOnLakeSurface } from './snow_surface_decorator';

describe('snow surface decorator', () => {
  it('snows on cold grass', () => {
    expect(
      placesTopSnow({ biomeTemp: -0.3, y: 80, topBlock: 'grass_block', aboveAir: true }),
    ).toBe(true);
  });

  it('no snow on warm', () => {
    expect(
      placesTopSnow({ biomeTemp: 1.5, y: 80, topBlock: 'grass_block', aboveAir: true }),
    ).toBe(false);
  });

  it('no snow if covered', () => {
    expect(
      placesTopSnow({ biomeTemp: -0.3, y: 80, topBlock: 'grass_block', aboveAir: false }),
    ).toBe(false);
  });

  it('ice freezes lake top', () => {
    expect(
      iceOnLakeSurface({ biomeTemp: -0.5, y: 64, topBlock: 'water', aboveAir: true }),
    ).toBe(true);
  });
});
